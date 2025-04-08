const { readFileSync, existsSync } = require("node:fs");
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
            app.use(setupStore);
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
        return [`import { STORE_KEY } from 'virtual:store';`];
      },
    });
  });
};
