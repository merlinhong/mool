const { accessSync, constants, existsSync } = require("fs");
module.exports = function virtual(api, options) {
  const virtualModuleIds = ["virturl:app-mount"];
  return {
    name: "vite-mooljs-virtual",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 页面刷新时触发
        if (req.url == "/@vite/client") {
          // 重新加载虚拟模块
          virtualModuleIds.forEach((vm) => {
            const mod = server.moduleGraph.getModuleById(`\0${vm}`);
            if (mod) {
              server.moduleGraph.invalidateModule(mod);
            }
          });
        }
        next();
      });
    },

    resolveId(id) {
      if (virtualModuleIds.includes(id)) {
        return "\0" + id;
      }
    },
    async load(id) {
      const DEFAULT_CODE = ` 
                export default async function (createApp,App,router){
             const GlobalApp = module.default?.(App)??App;
             module.onRouterGuard?.(router);
             const app = createApp(GlobalApp);
             module.onSetupPlugins?.(app);
             app.use(router);
             return app
        }`;
      const lines = DEFAULT_CODE.split("\n");
      if (id == "\0virturl:app-mount") {
        try {
          accessSync(api.resolve("src/app.tsx"), constants.F_OK | constants.R_OK);
          lines.splice(
            0,
            0,
            
            `import { useProvider } from 'mooljs';
             import  *  as module  from '/src/app.tsx';
            `,
          );
          if (options.access && existsSync('src/access.ts')) {
            lines.splice(
              0,
              0,
              `import  *  as access  from '/src/access.ts';`,
            );
            const targetIndex = lines.findIndex((line) =>
              line.includes("app.use(router);"),
            );
            lines.splice(targetIndex, 0, ` 
            const accessConfig = access.default?.(await module.getInitialState?.()??{});
            const { routes = [], layout = {}, getInitialState } = module;
            const layoutConfig = typeof layout === 'function' ? layout(await getInitialState?.()) : layout;
            const menuRoutes = await layoutConfig.menu?.request?.() ?? routes;
            app.use(useProvider,{globalConfig:{
              layout:layoutConfig,menuRoutes,access:accessConfig
            },router});
          `);
            return lines.join("\n")
          } else {
            lines.splice(
              lines.length - 1,
              0,
              `
              app.use(useProvider,{globalConfig:module});
             `
            );
            return DEFAULT_CODE
          }
        } catch (error) {
          return `export default function (createApp,App,router,){
                const app = createApp(App);
                app.use(router);
                return app
                }`;
        }
      }
    },
  };
}