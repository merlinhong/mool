import { Router } from 'vue-router';
import { App, inject } from "vue";

// core/access-provider.ts
const ACCESS_KEY = Symbol('access-context');
const APP_CONFIG = Symbol('app-config');
// function checkUserPermission(topath){

function checkPermision(options: { to: Record<string, any>; routes: any[]; access: {}; exclude?: string[] }) {
    const { to, routes = [], access = {}, exclude = ['/user/login'] } = options;
    // 假设我们有一个函数来检查用户是否有权限访问某个路由
    const hasNoPermission = !routes?.find(_ => _.path === to.path) && !exclude.includes(to.path);
    return (hasNoPermission || to.meta.access && !access[to.meta.access as string]) && to.path !== '/403'
}
// }
export const useProvider = async (app: App, options: { access?: Record<string, any>, router?: Router, globalConfig: Record<string, any> }) => {
    const { access = {}, router, globalConfig = {} } = options ?? {};
    app.config.globalProperties.$access = access
    // 注入全局上下文
    app.provide(ACCESS_KEY, access);
    app.provide(APP_CONFIG, globalConfig);
    const { routes = [], layout = {}, getInitialState = () => ({}) } = globalConfig;

    const layoutConfig = typeof layout === 'function' ? layout(getInitialState) : layout;

    const _routes = await layoutConfig.menu?.request?.() ?? routes;
    // // 路由系统集成
    router?.beforeEach((to, from, next) => {

        if (checkPermision({ to, routes: _routes, access })) {
            // 如果没有权限访问根路径，则重定向到 /403 页面
            next('/403'); // 只有在需要重定向时才调用 next(newLocation)
        } else {
            // 否则继续导航
            next(); // 继续导航到目标路径
        }
    })
}

// 获取权限上下文的hook
export const useAccess = () => {
    return inject(ACCESS_KEY) as Parameters<typeof useProvider>[1]['access']
}
export const getAppConfig = () => {
    return inject(APP_CONFIG) as Parameters<typeof useProvider>[1]['globalConfig']
}
