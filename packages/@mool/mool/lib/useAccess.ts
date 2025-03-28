import { Router } from 'vue-router';
import { App, inject } from "vue"
// core/access-provider.ts
const ACCESS_KEY = Symbol('access-context')

export const useProvider = (app: App, options: { access: Record<string, any>, router: Router }) => {
    const { access = {}, router } = options ?? {};
    app.config.globalProperties.$access = access
    // 注入全局上下文
    app.provide(ACCESS_KEY, access);
    // 路由系统集成
    router.beforeEach((to,form,next) => {
        if (to.meta.access&&!access[to.meta.access as string]?.()) {
            return { path: '/403' }
        }else{
            next()
        }
    })
}

// 获取权限上下文的hook
export const useAccess = () => {
    return inject(ACCESS_KEY) as Parameters<typeof useProvider>[1]['access']
}
