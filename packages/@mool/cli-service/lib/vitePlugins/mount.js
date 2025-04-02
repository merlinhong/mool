module.exports = function virtual(api, options) {
  const virtualModuleIds = ["virturl:app-mount"];
  // 将fs.access封装成返回Promise的函数
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
                const GlobalApp = config.default?.(App)??App;
                config.onRouterGuard?.(router);
                const app = createApp(GlobalApp);
                config.onSetupPlugins?.(app);
                app.use(router);
                return app
            }
          `;
      const lines = DEFAULT_CODE.split("\n");

      if (id == "\0virturl:app-mount") {
        const filepath = await checkFiles();
        if (filepath) {
          lines.splice(
            0,
            0,
            `import  *  as config  from '/src/${filepath}';`,
          );
          return lines.join("\n");
        } else {
          return `export default function (createApp,App,router,){
            const app = createApp(App);
            app.use(router);
            return app
            }`;
        }
      }
    },
  };
};
