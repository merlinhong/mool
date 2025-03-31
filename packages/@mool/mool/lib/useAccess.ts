import { Router } from 'vue-router';
import { App, inject } from "vue";

// core/access-provider.ts
const ACCESS_KEY = Symbol('access-context');
const APP_CONFIG = Symbol('app-config');
// function checkUserPermission(topath){

// }
export const useProvider = async (app: App, options: { access?: Record<string, any>, router?: Router, globalConfig: Record<string, any> }) => {
    const { access = {}, router, globalConfig = {} } = options ?? {};
    app.config.globalProperties.$access = access
    // 注入全局上下文
    app.provide(ACCESS_KEY, access);
    app.provide(APP_CONFIG, globalConfig);
    const { routes = [], layout = {}, getInitialState = () => ({}) } = globalConfig;

    const layoutConfig = typeof layout === 'function' ? layout(getInitialState) : layout;

    const _routes = await layoutConfig.menu.request?.();
    // // 路由系统集成
    router?.beforeEach((to, from, next) => {
        console.log(to);
        
        // 假设我们有一个函数来检查用户是否有权限访问某个路由
        const hasNoPermission = !_routes.find(_=>_.path===to.path)&&to.path!='/user/login';

        if (hasNoPermission&&to.path!=='/403') {
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
