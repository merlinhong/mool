
/**
 * 判断路由是否应该在菜单中隐藏
 */
function shouldClosePermision(route, access,pAccess=false) {
    return (access && route.meta?.access && !access[route.meta?.access])||pAccess;
}

/**
 * 将路由转换为ProLayout菜单数据
 */
exports.transformRoutes = function (routes, access,pAccess=false) {

    // 转换路由为菜单数据
    const filterRouteByAcccess = (route) => {
        // 跳过不应该显示在菜单中的路由
        if (
            shouldClosePermision(route, access,pAccess)
        ) {
            return {
                ...route,
                component:'/src/404.vue',
                routes:exports.transformRoutes(route.routes,access,true)
            };
        }
        // 基本菜单项
        return {
            ...route,
            routes:route.routes&&exports.transformRoutes(route.routes,access)
        };
    };
    return routes
        ?.map((route) => filterRouteByAcccess(route))
        .filter(Boolean)
}
