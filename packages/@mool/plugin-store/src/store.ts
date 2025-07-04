// src/libs/store-manager.ts
import { createGlobalState } from "@vueuse/core";
import { inject, type App, InjectionKey } from "vue";

type ModuleInitializer<T = any> = () => T;
type StoreModules = Record<string, ModuleInitializer>;

// 创建注入的 Symbol 键（保证类型安全）
export const STORE_KEY = Symbol("global-store") as InjectionKey<StoreModules>;

/**
 * 自动加载 store 模块的管理器
 */
export class StoreManager {
  private static instance: StoreManager;
  private modules: StoreModules = {};

  private constructor() { }

  public static getInstance(): StoreManager {
    if (!StoreManager.instance) {
      StoreManager.instance = new StoreManager();
    }
    return StoreManager.instance;
  }

  /**
   * 初始化全局 Store
   */
  public async initialize(
    app: App,
    options?: {
      initialState?: Record<string, any>;
    },
  ) {
    // 自动加载模块
    const moduleFiles = import.meta.glob<{ default: ModuleInitializer }>(
      "/src/store/*.ts",
      {
        eager: true,
      }, // 明确指定导入内容 }
    );

    const pageModuleFiles = import.meta.glob<{ default: ModuleInitializer }>(
      `/src/pages/**/store/**/*.ts`,
      {
        eager: true,
      }
    );
    // 注册自动发现的模块
    Object.entries(moduleFiles).forEach(([path, module]) => {
      const moduleName = path.match(/([^/]+)\.ts$/)?.[1];
      if (moduleName) {
        this.register(moduleName, module.default);
      }
    });

    // 注册自动发现的模块
    Object.entries(pageModuleFiles).forEach(([path, module]) => {
      // 假设路径格式为 /src/pages/页面名/store/xxx.ts
      const moduleName = path.match(/\/src\/pages\/([^\/]+)\/store\/(.+)\.ts$/);
      if (moduleName) {
        this.register(`${moduleName[1]}.${moduleName[2].includes('/') ? moduleName[2].replace('/', '.') : moduleName[2]}`, module.default);
      }
    });

    // 注册自定义模块
    if (options?.initialState) {
      this.register("@@initialState", () => options.initialState);
    }

    // 注入 Vue 应用
    app.provide(STORE_KEY, this.modules);
  }

  /**
   * 注册新模块
   */
  public register<T>(namespace: string, initializer: ModuleInitializer<T>) {
    if (this.modules[namespace]) {
      console.warn(`[StoreManager] 模块 ${namespace} 已存在，将被覆盖`);
    }
    this.modules[namespace] = createGlobalState(initializer);
  }

  /**
   * 获取所有模块
   */
  public getModules(): StoreModules {
    return this.modules;
  }
}

// 初始化函数
export const setupStore = (app: App, options: { initialState: {} }) => {
  const storeManager = StoreManager.getInstance();
  storeManager.initialize(app, options);
  return storeManager;
};
export const useStore = (namespace) => {
  const modules = inject(STORE_KEY, "");
  if (!modules?.[namespace]) {
    throw new Error(`[useStore] 未找到命名空间为 ${namespace} 的模块`);
  }
  return modules[namespace]();
};
