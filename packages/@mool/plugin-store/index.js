const { readFileSync, existsSync, readdirSync } = require("node:fs");
module.exports = (api, options) => {
  api.applyPlugins((config) => {
    // 检查 @mooljs/plugin-layout 插件是否存在，且 @mooljs/plugin-access 插件尚未添加
    config.plugins.push({
      name: "@mooljs/plugin-store",
      after: [],
      injectImports: (opt) => {
        return [`import { setupStore } from 'virtual:store';`];
      },
      // 运行时逻辑
      runtime: (ctx) => `
            app.use(setupStore,{
              initialState:(await config.getInitialState?.()) ?? {}
            });
          `,
      // 虚拟模块定义
      virtualModule: () => ({
        id: "virtual:store",
        content: readFileSync(
          api.resolve("node_modules/@mooljs/plugin-store/dist/store.mjs"),
          "utf-8",
        ),
      }),
      injectMool: () => {
        return [`export { useStore } from 'virtual:store';`];
      },
      injectModuleType: () => {
        const storeFiles = readdirSync(api.resolve('src/store'))
          .filter((file) => file.endsWith(".ts"))
          .map((file) => file.replace(".ts", ""));
        const moduleTypes = storeFiles
          .map(
            (module) => `    ${module}: ReturnType<typeof import("src/store/${module}")["default"]>;\n`,
          ).concat([`    '@@initialState':ReturnType<(typeof import("src/app.ts"))["getInitialState"]|(typeof import("src/app.tsx"))["getInitialState"]>;`])
          .join("");
        return [
          `  interface StoreModule {\n${moduleTypes}\n  }\n  export const useStore: <K extends keyof StoreModule>(_namespace: K) => StoreModule[K]`
        ]
      }
    });
  });
};
