import { App, inject } from "vue";
import { UseProviderOptions, CheckPermissionOptions, IMenuRoutes, LayoutConfig } from './type'; // 假设type.ts和hooks文件在同一目录
import {createStore} from './useStore';
// core/access-provider.ts
const ACCESS_KEY = Symbol('access-context');
const APP_CONFIG = Symbol('app-config');
const LAYOUT_CONFIG = Symbol('layout-config');
const MENU_ROUTES = Symbol('menu-config');

function findRouteByPath(routes: IMenuRoutes[], targetPath: string): [IMenuRoutes | null, IMenuRoutes] | null {
    for (const route of routes) {
        if (route.path === targetPath) {
            return [null, route];
        }
        if (route.routes && route.routes.length > 0) {
            const foundRoute = findRouteByPath(route.routes, targetPath);
            if (foundRoute) {
                return [route, foundRoute[1]];
            }
        }
    }
    return null;
};
function checkPermision(options: CheckPermissionOptions) {
    const { to, routes = [], access = {}, exclude = ['/user'] } = options;
    // 递归函数，用于深度查询路由

    const hasNoPermision = (access: Record<string, any>, currAccess?: string) => {
        return currAccess && !access[currAccess];
    }
    const res = findRouteByPath(routes, to.path);

    if (res) {
        const [parentRoutes, route] = res;
        const noPermission = (hasNoPermision(access, parentRoutes?.meta?.access) || hasNoPermision(access, route.meta?.access)) && !exclude.some(_ => to.path.includes(_));
        return noPermission && to.path !== '/403'
    } else {
        return false
    }
}

export const useProvider = async (app: App, options: UseProviderOptions) => {
    const { router, globalConfig } = options ?? {};
    const { access = [], layout = {}, menuRoutes = [],initialState={} } = globalConfig;
    app.config.globalProperties.$access = access;
    app.provide(ACCESS_KEY, access);
    app.provide(APP_CONFIG, globalConfig);
    app.provide(LAYOUT_CONFIG, layout);
    app.provide(MENU_ROUTES, menuRoutes);
    /**
     * 注入全局store
     */
    createStore('@@initialState',initialState);

    router?.addRoute({
        path: '/403',
        component: layout.unAccessible ?? (() => import('@mooljs/plugin-layout/layouts/403.vue'))
    });
    router?.beforeEach((to, from, next) => {
        const exclude = menuRoutes.filter(_ => _.meta?.layout === false)?.map(_ => _.path);
        if (checkPermision({ to, routes: menuRoutes, access, exclude })) {
            next('/403');
        } else {
            next();
        }
    });
}

export const useAccess = () => {
    return inject(ACCESS_KEY) as UseProviderOptions['globalConfig']['access']
}
export const getAppConfig = () => {
    return inject(APP_CONFIG) as UseProviderOptions['globalConfig']
}
export const useMenuRoutes = () => {
    return inject(MENU_ROUTES) as UseProviderOptions['globalConfig']['menuRoutes']
}
export const useLayout = () => {
    return inject(LAYOUT_CONFIG) as UseProviderOptions['globalConfig']['layout']
}
