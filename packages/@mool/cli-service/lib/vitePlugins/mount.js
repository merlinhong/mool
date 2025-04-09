const { readFileSync,writeFileSync } = require("fs");
const { checkFiles } = require('@mooljs/cli-service/lib/util/checkFile');
const MARKER = '// auto generate by mool plugins'         

module.exports = function virtual(api, options) {
  const vmGenerator = api.resolveMaxPlugins();
  const virtualModules = vmGenerator.generateVirtualModules();
  const virtualModuleIds = ["virturl:app-mount", 'virturl:router'];
  const moduleTypes = vmGenerator.generateModuleType();
  function generateModuleType(pathname = 'types/module.d.ts') {
    try {
      // 读取类型文件
      let content = readFileSync(api.resolve(pathname), 'utf-8')
      
      // 定位目标模块声明
      const moduleRegex = /declare\s+module\s+"mooljs"\s*\{([\s\S]*?)\}(?=\s*(?:declare|module|}|$))/g
      const match = moduleRegex.exec(content)
      
      if (!match) {
        return writeFileSync(api.resolve(pathname), `${content}\ndeclare module "mooljs" {\n${MARKER}\n${moduleTypes}\n}`, 'utf-8')
      }
  
      // 检查是否已有生成内容
      const existingContent = match[1]
      if (existingContent.includes(MARKER)) {
        content = content.replace(moduleRegex, `declare module "mooljs" {\n${MARKER}\n${moduleTypes}\n}`)
      } else {
        // 插入新内容
        const insertionPoint = content.indexOf('declare module "mooljs"') 
          + 'declare module "mooljs"'.length
        content = [
          content.slice(0, insertionPoint),
          ` {\n  ${MARKER}\n${moduleTypes}\n}`
        ].join('')
      }
  
      // 写入文件
      writeFileSync(api.resolve(pathname), content, 'utf-8')
      console.log('✅ mooljs类型声明更新成功')
  
    } catch (error) {
      console.error('❌ mooljs生成类型声明失败:', error.message)
      process.exit(1)
    }
  }
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
    transform(code, id) {
      if (id.includes('mooljs.js')) {
        return {
          code: `${code}\n${vmGenerator.generateImportsMool()}`,
          map: null
        }
      }
    },
    buildStart() {
      generateModuleType();
    }
  };
}