
import {createGlobalState} from '@vueuse/core';
const modules = {} as Record<string, () => any>;

/**
 * 加载store下的所有命名空间模块，不支持嵌套定义
 */
(() => {
  // 自动导入所有模块
  const moduleFiles = import.meta.glob<{ default: () => any }>(
    "/src/store/*.ts",
    { eager: true },
  );

  for (const path in moduleFiles) {
    const moduleName = path.match(/([^/]+)\.ts$/)?.[1];
    if (moduleName) {
      modules[moduleName] = createGlobalState(moduleFiles[path].default);
    }
  }
  return modules;
})()
/**
 * @param {string} _namespace {}
 */

export const useStore = (namespace: string) => {
  console.log(modules);
  return modules[namespace]?.()||{};
}