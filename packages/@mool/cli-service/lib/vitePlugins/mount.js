const { existsSync, readFileSync } = require("fs");
const { checkFiles } = require('@mooljs/cli-service/lib/util/checkFile');

module.exports = function virtual(api, options) {
  const vmGenerator = api.resolveMaxPlugins();
  const virtualModules = vmGenerator.generateVirtualModules();
  const virtualModuleIds = ["virturl:app-mount",'virturl:router'];
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
      if (virtualModuleIds.includes(id) || Object.keys(virtualModules).includes(id)) {
        return "\0" + id;
      }
    },
    async load(id) {
      const imports = [];

      if (id == "\0virturl:app-mount") {
        // if(options.windicss){
        //   // lines.splice(0, 0, `import 'virtual:windi.css';`);
        //   imports.push(`import 'virtual:windi.css';`)
        // }
        imports.push(
          vmGenerator.generateImports()
        );
        const filepath = await checkFiles();
        if (filepath) {
          // console.log(vmGenerator.injectkey());
          imports.unshift(`import  *  as config  from '/src/${filepath}';`)
          return ` 
          ${imports.join('\n')}
          export default async function (createApp,App,router){
          const GlobalApp = config.default?.(App)??App;
          config.onRouterGuard?.(router);
          const app = createApp(GlobalApp);
          config.onSetupPlugins?.(app);
          ${vmGenerator.generateRuntime()};
          app.use(router);
          return app
          }`;
        } else {
          return `
          ${imports.join('\n')}
          const config = {};
          export default async function (createApp,App,router,){
          const app = createApp(App);
          ${vmGenerator.generateRuntime()}
          app.use(router);
          return app
           }`;
        }

      }
      if (id == "\0virturl:router") {
        const { existsSync } = require("fs");
        if (existsSync(api.resolve("src/layouts"))) {
          return `
          import { setupLayouts } from 'virtual:generated-layouts'
          import { createRouter, createWebHistory,createWebHashHistory,RouterView} from 'vue-router'
          import routes from '~pages';
          const router = createRouter({
            history: ${options.history == 'browser' ? 'createWebHistory()' : 'createWebHashHistory()'},
            routes:setupLayouts(routes)
          })
          export default router
          export {RouterView}
          `
        } else {
          return `
          import { createRouter, createWebHistory,createWebHashHistory,RouterView} from 'vue-router'
          import routes from '~pages';
          const router = createRouter({
            history: ${options.history == 'browser' ? 'createWebHistory()' : 'createWebHashHistory()'},
            routes
          })
          export default router
          export {RouterView}
          `
        }
      }
      
      const modules = virtualModules[id.replace('\0', '')];
      if (modules) return modules;
    },
    transform(code,id){
      if(id.includes('mooljs.js')){
        const newcode = 
        `
        ${vmGenerator.generateImportsMool()}
        ${code}
        `
        return {
          code:newcode,
          map:null
        }
      }
    }
  };
}