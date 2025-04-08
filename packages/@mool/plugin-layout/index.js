const { readFileSync,existsSync } = require('node:fs');
const pages = require("vite-plugin-pages").default;
const merge = require("lodash.merge");
const pagesPluginOption = {
  dirs: "src/pages", // 需要生成路由的文件目录，默认就是识别src下面的pages文件
  exclude: ["**/components/*.vue"], // 排除在外的目录，上面配置目录的例子，里面有 components 目录，我们不希望他被解析为路由
};

module.exports = async (api, options) => {
  if (options.routes && Array.isArray(options.routes)) {
    pagesPluginOption.onRoutesGenerated = () => {
      return options.routes?.map(_ => {
        if (_.routes && _.meta.layout !== false) {
          return [_, ..._.routes]
        } else if (_.meta.layout === false && _.routes) {
          return {
            ..._,
            children: _.routes
          }
        } else {
          return _
        }
      }).flat()
    }
  }
  api.chainVite((config) => {
    config.plugins.push(
      pages(merge(pagesPluginOption, options.route ?? {})),
    );
  });
  api.applyPlugins((config) => {
    config.plugins.push(
      {
        name: '@mooljs/plugin-layout',
        after:[],
        injectImports: (opt) => {
        
          return [ `import { useLayout, getAppConfig} from 'virtual:layout'; 
          ${existsSync('src/access.ts') ? `import  *  as accessConfig  from '/src/access.ts';` : `const accessConfig = {default:()=>({})};`}
          `];
        },
        // 运行时逻辑
        runtime: (ctx) => `
          const {routes,access,layout} = await getAppConfig({config,access:accessConfig});
          app.use(useLayout,{
            routes,
            layout
          });
        `,
        // 虚拟模块定义
        virtualModule: () => ({
          id: 'virtual:layout',
          content: readFileSync(api.resolve('node_modules/@mooljs/plugin-layout/dist/layout.mjs'), 'utf-8')
        }),
      }
    );
  });
};
