
import { UseProviderOptions, IMenuRoutes, LayoutConfig } from "@mooljs/plugin-layout/type";

import { App, markRaw, readonly } from "vue";
import {type} from './utils/type';

export const LAYOUT_CONFIG = Symbol('layout-config');
export const MENU_ROUTES = Symbol('menu-config');


function convertToArray(value:any) {
    // 如果已经是数组，则直接返回
    if (Array.isArray(value)) {
      return value;
    }
    // 否则，将非数组值包装在数组中,确保最终返回数组
    return [];
}
function convertToObject(value) {
    // 如果value已经是对象，并且不是null
    if (type(value)==='object') {
      return value;
    }
    // 对于基本类型或null/undefined，将其作为值放入一个新对象的属性中
    return {};
}
export const getAppConfig = async (options: UseProviderOptions) => {
    const { config={}, access = { default: () => ({}) } } = options;
    const { routes = [], layout = {}, getInitialState } = config;

    const initialState = (await getInitialState?.()) ?? {};
    const accessConfig = access.default?.(initialState);

    const layoutConfig =
        typeof layout === "function" ? layout(initialState) : layout;

    const menuRoutes =
        (await (layoutConfig as LayoutConfig).menu?.request?.()) ?? routes;
    
    return { routes: convertToArray(menuRoutes), access: convertToObject(accessConfig), layout: convertToObject(layoutConfig) };
};
export const useLayout = (app: App, options: { accessInjectKey: symbol; routes: IMenuRoutes[], layout: LayoutConfig }) => {
    // const { accessInjectKey, routesInjectKey } = options;
    const { routes=[], layout=[] } = options??{};

    /**
     * 注入菜单路由
     */
    app.provide(MENU_ROUTES, readonly(markRaw(routes)));
    
    /**
     * 注入布局配置
     */

    app.provide(LAYOUT_CONFIG, readonly(markRaw(layout)));

    /**
     * 获取插件的注入key
     */
    // ACCESS_KEY = accessInjectKey;

    /**
     * 注入全局store
     */
    // createStore('@@initialState',initialState);
};