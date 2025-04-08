const { readFileSync, existsSync } = require('node:fs');
module.exports = (api, options) => {
  api.applyPlugins((config) => {
    // 检查 @mooljs/plugin-layout 插件是否存在，且 @mooljs/plugin-access 插件尚未添加
    if (options.layout&&options.access) {
      config.plugins.push(
        {
          name: '@mooljs/plugin-access',
          after: ['@mooljs/plugin-layout'],
          injectImports: (opt) => {
            return [`import { useAccess } from 'virtual:access';`,];
          },
          // 运行时逻辑
          runtime: (ctx) => `
            app.use(useAccess, {
              access,
              routes,
              router,
              layout
            });
          `,
          // 虚拟模块定义
          virtualModule: () => ({
            id: 'virtual:access',
            content: readFileSync(api.resolve('node_modules/@mooljs/plugin-access/dist/access.mjs'), 'utf-8')
          }),
          injectMool:()=>{
            return [`import { ACCESS_KEY } from 'virtual:access';`]
          }
        }
      );
    }

  });
};

