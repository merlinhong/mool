import {  CheckPermissionOptions, IMenuRoutes,UseProviderOptions } from './type'; // 假设type.ts和hooks文件在同一目录
import { App, inject } from "vue";

export const ACCESS_KEY = Symbol('access-context');

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
export const useAccess = (app:App,options:UseProviderOptions)=>{
    const { access = {}, layout = {}, routes = [],router} = options;
    
    app.config.globalProperties.$access = access;

    app.provide(ACCESS_KEY, access);

    router?.addRoute({
        path: '/403',
        component:layout.unAccessible ?? (() => import('@mooljs/plugin-layout/layouts/403.vue')),
    });
    router?.beforeEach((to, from, next) => {
        const exclude = routes.filter(_ => _.meta?.layout === false)?.map(_ => _.path);
        if (checkPermision({ to, routes, access, exclude })) {
            next('/403');
        } else {
            next();
        }
    });

}