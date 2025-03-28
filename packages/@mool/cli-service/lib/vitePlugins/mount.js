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
                import  *  as module  from '/src/app.tsx';
                export default function (createApp,App,router){
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
          if (options.access && existsSync('src/access.ts')) {
            lines.splice(
              0,
              0,
              `import  *  as access  from '/src/access.ts';
               import { useProvider } from 'mooljs';
              `,
            );
            const targetIndex = lines.findIndex((line) =>
              line.includes("app.use(router);"),
            );
            lines.splice(targetIndex, 0, ` 
          const accessConfig = access.default?.(module.getInitialState?.()??{});
          app.use(useProvider,{access:accessConfig,router});
          `);
            return lines.join("\n")
          } else {
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