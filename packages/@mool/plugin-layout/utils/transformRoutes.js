
/**
 * 判断路由是否应该在菜单中隐藏
 */
function shouldHideInMenu(route, access) {
    return access && route.meta?.access && !access[route.meta?.access];
}

/**
 * 将路由转换为ProLayout菜单数据
 */
exports.transformRoutes = function (routes, access) {

    // 转换路由为菜单数据
    const filterRouteByAcccess = (route) => {
        // 跳过不应该显示在菜单中的路由
        if (
            shouldHideInMenu(route, access)
        ) {
            return null;
        }
        // 基本菜单项

        return route;
    };
    return routes
        .map((route) => filterRouteByAcccess(route))
        .filter(Boolean)
}
