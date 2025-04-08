import { App, inject } from "vue";
import { IMenuRoutes, LayoutConfig } from "./type"; // 假设type.ts和hooks文件在同一目录


export const useAccess = () => {
  return (inject(ACCESS_KEY, '') as ReturnType<
    (typeof import("src/access"))["default"]
  >)

};

export const useMenuRoutes = () => {
  return inject(MENU_ROUTES,[]) as IMenuRoutes[]
};

export const useLayout = () => {
  return inject(LAYOUT_CONFIG,'') as LayoutConfig
}

export const useStore = <T = any>(namespace: string): T => {
  const modules = inject(STORE_KEY,'')
  if (!modules?.[namespace]) {
    throw new Error(`[useStore] 未找到命名空间为 ${namespace} 的模块`)
  }
  return modules[namespace]() as T
}