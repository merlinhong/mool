

/**
 * 从路由配置中提取菜单标题
 */
function getMenuTitle(route) {
    // 使用 meta.title
    if (route.meta && route.meta.title) {
        return route.meta.title;
    }

    // 其次使用 name
    if (route.name) {
        const name = route.name;
        return name
            .replace(/[-_](\w)/g, (_, c) => " " + c.toUpperCase())
            .replace(/^\w/, (c) => c.toUpperCase());
    }

    // 最后使用 path
    return route.path
        .split("/")
        .pop()
        .replace(/[-_](\w)/g, (_, c) => " " + c.toUpperCase())
        .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * 判断路由是否应该在菜单中隐藏
 */
function shouldHideInMenu(route,access) {
    return route.meta && route.meta.hideInMenu||(access&&route.meta.access&&!access[route.meta.access]);
}

/**
 * 判断是否应该隐藏子菜单
 */
function shouldHideChildrenInMenu(route) {
    return route.meta && route.meta.hideChildrenInMenu;
}

/**
 * 判断是否应该平铺子菜单
 */
function shouldFlatMenu(route) {
    // 优先使用 menu.flatMenu
    if (route.menu && route.menu.flatMenu !== undefined) {
        return route.menu.flatMenu;
    }

    // 其次使用 meta.flatMenu
    return route.meta && route.meta.flatMenu;
}

/**
 * 从路由中提取图标组件
 */
function getMenuIcon(route) {
    return route.meta && route.meta.icon;
}

/**
 * 将路由转换为ProLayout菜单数据
 */
export function useMenuFromRoutes(routes, options,access) {
    // 默认配置
    const defaultOptions = {
        rootPath: "/",
        ignorePaths: ["/login", "/404", "/403"],
        ignoreNames: ["login", "not-found", "forbidden"],
        ignorePathsStartsWith: ["/_"],
    };

    const mergedOptions = { ...defaultOptions, ...options };

    // 转换路由为菜单数据
    const transformRouteToMenu = (route, parentPath = "") => {
        // 跳过不应该显示在菜单中的路由
        if (
            shouldHideInMenu(route,access) ||
            mergedOptions.ignorePaths.includes(route.path) ||
            (route.name && mergedOptions.ignoreNames.includes(route.name)) ||
            mergedOptions.ignorePathsStartsWith.some((prefix) =>
                route.path.startsWith(prefix)
            )
        ) {
            return null;
        }

        // 构建完整路径
        const fullPath = route.path.startsWith("/")
            ? route.path
            : `${parentPath}/${route.path}`.replace(/\/+/g, "/");

        // 基本菜单项
        const menuItem = {
            path: fullPath,
            component:route.component,
            meta: {
                title: getMenuTitle(route),
                icon: getMenuIcon(route),
                ...route.meta,
            },
        };

        // 处理子路由 - 使用 routes 字段代替 children
        const childRoutes = route.routes || [];

        if (childRoutes.length > 0 && !shouldHideChildrenInMenu(route)) {
            const children = childRoutes
                .map((child) => transformRouteToMenu(child, fullPath))
                .filter(Boolean);

            if (children.length > 0) {

                // 处理平铺菜单
                if (shouldFlatMenu(route)) {
                    return [menuItem, ...children];
                } else {
                    menuItem.routes = children;
                }
            }
        }

        return menuItem;
    };

    // 计算菜单数据
    const menuData = computed(() => {
        // 找到根路由
        let menuItems = [];
        // 如果没有找到根路由，转换所有顶级路由
        menuItems = routes
            .map((route) => transformRouteToMenu(route))
            .filter(Boolean);

        return menuItems.flat();
    });

    return {
        menuData,
    };
}
