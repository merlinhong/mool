const { existsSync,readFileSync } = require("fs");
const {checkFiles} = require('@mooljs/cli-service/lib/util/checkFile');
module.exports = function virtual(api, options) {
  const virtualModuleIds = ['virturl:access',"virturl:app-mount"];
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
      // try {
      //   require.resolve('@mooljs/plugin-access');

      // } catch (error) { 
      // }
      const DEFAULT_CODE = ` 
                import {ACCESS_KEY,useAccess} from 'virturl:access';
                
                export default async function (createApp,App,router){
                const GlobalApp = config.default?.(App)??App;
                config.onRouterGuard?.(router);
                const app = createApp(GlobalApp);
                config.onSetupPlugins?.(app);
                app.use(router);
                return app
        }`;
        const SETUP_FUNC = `async function setupProvider(app,options){
          const {router,...opt} = options;
          const {routes=[],access={},layout={}} = await getAppConfig(opt??{});
          app.use(useAccess,{
            access,
            routes,
            router,
            layout
          });
          app.use(useProvider,{
            accessInjectKey:ACCESS_KEY,
            routes,
            layout
          })
        }`
      const lines = DEFAULT_CODE.split("\n");
      if (id == "\0virturl:app-mount") {
        if(options.windicss){
          lines.splice(0, 0, `import 'virtual:windi.css';`);
        }
        const filepath = await checkFiles();
        if (filepath) {
          lines.splice(
            0,
            0,
            SETUP_FUNC
          );
          lines.splice(
            0,
            0,

            `import { useProvider,getAppConfig } from 'mooljs';
             import  *  as config  from '/src/${filepath}';
            `,
          );

          lines.splice(
            0,
            0,
            existsSync('src/access.ts') ? `import  *  as access  from '/src/access.ts';` : `const access = {default:()=>({})};`,
          );

          
          const targetIndex = lines.findIndex((line) =>
            line.includes("app.use(router);"),
          );
          lines.splice(targetIndex, 0, ` 
          await setupProvider(app,{config,access,router});
        `);
          return lines.join("\n");
        } else {
          return `
          // import { createStore } from 'mooljs';
          import { useProvider } from 'mooljs';
          const getAppConfig = {};
          ${SETUP_FUNC}
          export default async function (createApp,App,router,){
          const app = createApp(App);
          await setupProvider(app,{router});
          app.use(router);
          return app
           }`;
        }

      }
    },
  };
}