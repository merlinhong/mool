import { App, inject } from "vue";
import { IMenuRoutes, LayoutConfig } from "./type"; // 假设type.ts和hooks文件在同一目录
let ACCESS_KEY: symbol | '';

let LAYOUT_CONFIG: symbol | '';

let MENU_ROUTES: symbol | '';

export const useAccess = () => {
  ACCESS_KEY = inject('@@access-key','');
  return ACCESS_KEY
    ? (inject(ACCESS_KEY) as ReturnType<
      (typeof import("src/access"))["default"]
    >)
    : {};
};

export const useMenuRoutes = () => {
  MENU_ROUTES = inject('@@routes-key','');
  return MENU_ROUTES ? (inject(MENU_ROUTES) as IMenuRoutes) : {};
};

export const useLayout = () => {
  LAYOUT_CONFIG = inject('@@layout-key','') as '';
  return LAYOUT_CONFIG ? (inject(LAYOUT_CONFIG) as LayoutConfig) : {}
}
