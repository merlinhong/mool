const { readFileSync, existsSync } = require("node:fs");
const Layout = require("vite-plugin-vue-layouts").default;
const merge = require("lodash.merge");

module.exports = async (api, options) => {
  const layoutOptions = (layout) => {
    if (layout) {
      return {
        layoutsDirs: api.resolve(
          "node_modules/@mooljs/plugin-layout/src/layouts",
        ),
      };
    } else {
      return {};
    }
  };
  api.chainVite((config) => {
    config.plugins.push(
      Layout(merge(layoutOptions(options.layout), options.layout ?? {})),
    );
  });
  api.applyPlugins((config) => {
    if (options.layout) {
      config.plugins.push({
        name: "@mooljs/plugin-layout",
        after: [],
        injectImports: (opt) => {
          return [
            `import { setupLayout, getAppConfig} from 'virtual:layout'; 
            `,
          ];
        },
        // 运行时逻辑
        runtime: (ctx) => `
            const {routes,layout} = await getAppConfig({config});
            app.use(setupLayout,{
              routes,
              layout
            });
          `,
        // 虚拟模块定义
        virtualModule: () => ({
          id: "virtual:layout",
          content: readFileSync(
            api.resolve("node_modules/@mooljs/plugin-layout/dist/layout.mjs"),
            "utf-8",
          ),
        }),
        injectMool: () => {
          return [`export { useLayout,useMenuRoutes } from 'virtual:layout'`]
        }
      });
    }
  });
};
