import { Router } from "vue-router";
import { DefineComponent, VNode } from "vue";
type GetInitialStateReturnType<T> = T extends () => infer R ? R : never;
export interface RuntimeConfig {
    routes?: IMenuRoutes[];
    layout?: ILayout | ((option: GetInitialStateReturnType<RuntimeConfig["getInitialState"]>) => LayoutConfig);
    getInitialState?: (typeof import("src/app.ts"))["getInitialState"] | (typeof import("src/app.tsx"))["getInitialState"];
}
export type GetInitialState = GetInitialStateReturnType<RuntimeConfig['getInitialState']>;
export interface IMenuRoutes {
    path: string;
    /**
     * 当前页面渲染的组件,must be a absolute path
     */
    component?: string;
    meta?: RouteMeta;
    routes?: IMenuRoutes[];
}
export interface RouteMeta {
    /**
     * 是否在菜单中隐藏
     */
    hideInMenu?: boolean;
    /**
     * 是否在菜单中隐藏其子节点
     */
    hideChildrenInMenu?: boolean;
    /**
     * 是否渲染菜单
     */
    menuRender?: boolean;
    /**
     * 是否渲染页脚
     */
    footerRender?: boolean;
    /**
     * 是否渲染头部
     */
    headerRender?: boolean;
    /**
     * 当前路由是否使用内置pro layout
     */
    layout?: boolean;
    /**
     * 权限相关设置
     */
    access?: string;
    /**
     * 是否打平菜单
     */
    flatMenu?: boolean;
    /**
     * 当前菜单icon
     */
    icon?: string;
    /**
     * 菜单或当前页面标题
     */
    title: string;
}
export interface ILayout {
    headerRender?: DefineComponent<{}, {}, any> | (() => VNode);
    footerRender?: DefineComponent<{}, {}, any> | (() => VNode);
    rightRender?: DefineComponent<{}, {}, any> | (() => VNode);
    unAccessible?: DefineComponent<{}, {}, any> | (() => VNode);
    noFound?: DefineComponent<{}, {}, any> | (() => VNode);
    logout?: DefineComponent<{}, {}, any> | (() => VNode);
}
export interface LayoutConfig extends ILayout {
    menu?: {
        request?: () => Promise<IMenuRoutes[]>;
    };
}
export interface UseProviderOptions {
    config: RuntimeConfig;
    access?: {
        default: (typeof import("src/access"))["default"];
    };
    router?: Router;
}
