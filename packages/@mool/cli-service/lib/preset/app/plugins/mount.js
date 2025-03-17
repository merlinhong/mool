
const path = require("path");
const {accessSync,existsSync,constants} = require("fs");
const relative = (_path,relative)=>{
  return path.relative(
    process.cwd(),
    path.resolve(relative?process.cwd():__dirname, _path),
  )
};
const generateLocale = (code,options)=>{
  const imports = 'import setupI18n from "@mooljs/cli-service/lib/preset/app/i18n.js"';
  const setupI18n = `setupI18n(app,${options.locale??'{}'})`;
  return existsSync(relative("./src/locale",true)) ? code.replace('// import-i18n',imports).replace('// setup-i18n',setupI18n) : code;
}
module.exports =  function virtual(options){
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
        if (id == "\0virturl:app-mount") {
            try {
              accessSync(relative("./src/app.tsx",true),constants.F_OK|constants.R_OK);
                return generateLocale(` // import-i18n
                         import  *  as module  from '/src/app.tsx';
                         export default function (createApp,App,router){
                         const GlobalApp = module.default?.(App)??App;
                         module.onRouterGuard?.(router);
                         const app = createApp(GlobalApp);
                         app.use(router);
                         return app;
                }
                `,options);
              } catch (error) {
                return generateLocale(`
                // import-i18n
                export default function (createApp,App,router,){
                const app = createApp(App);
                app.use(router);
                return app
                }`,options);
              }
        }
      },
    };
  }