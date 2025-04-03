import { Router } from "vue-router";
import { App, DefineComponent, VNode } from "vue";

type GetInitialStateReturnType<T> = T extends () => infer R ? R : never;

// 定义全局配置接口
export interface RuntimeConfig {
  routes?: IMenuRoutes[];
  layout?:
    | ILayout
    | ((
        option: GetInitialStateReturnType<RuntimeConfig["getInitialState"]>,
      ) => LayoutConfig);
  getInitialState?: (typeof import("src/app.ts"))["getInitialState"]|(typeof import("src/app.tsx"))["getInitialState"];
}

export type GetInitialState = GetInitialStateReturnType<RuntimeConfig['getInitialState']>;
// 定义路由配置接口
export interface IMenuRoutes {
  path: string;
  /**
   * 当前页面渲染的组件,must be a absolute path
   */
  component?: string;
  meta?: RouteMeta;
  routes?: IMenuRoutes[];
}

// 定义路由元数据接口
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
// 定义布局配置接口
export interface LayoutConfig extends ILayout {
  menu?: {
    request?: () => Promise<IMenuRoutes[]>;
  };
}

// 定义useProvider函数的参数类型
export interface UseProviderOptions {
  config: RuntimeConfig;
  access?: {
    default:(typeof import("src/access"))["default"];
  }
  router?: Router;
}
