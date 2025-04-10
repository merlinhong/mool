const { readFileSync, readdirSync } = require('node:fs');
module.exports = (api, options) => {
  api.applyPlugins((config) => {
    // 检查 @mooljs/plugin-layout 插件是否存在，且 @mooljs/plugin-access 插件尚未添加
    if (options.locale) {
      config.plugins.push(
        {
          name: '@mooljs/plugin-locale',
          after: [],
          injectImports: (opt) => {
            return [` import { setupLocale } from 'virtual:locale';`];
          },
          // 运行时逻辑
          runtime: (ctx) => `
            app.use(setupLocale, ${JSON.stringify(options.locale)});
          `,
          // 虚拟模块定义
          virtualModule: () => ({
            id: 'virtual:locale',
            content: readFileSync(api.resolve('node_modules/@mooljs/plugin-locale/dist/locale.mjs'), 'utf-8')
          }),
          injectMool: () => {
            return [`export {useLocale} from 'virtual:locale';`]
          },
          injectModuleType: () => {
            const locales = readdirSync(api.resolve('src/locale'))
              .filter((file) => file.endsWith(".ts"))
              .map((file) => `  "${file.replace(".ts", "")}":string;\n `).join('');

            return [
              `  interface LocaleModule {\n   ${locales}  \n  }\n   interface UseLocaleReturn {\n    t: (key: string, ...args: any[]) => string;\n    getLocale: ()=>Ref<string>;\n    addLocale: (lang: string, message: Record<string,any>) => void;\n    getAllLocales: () => string[];\n    setLocale: (lang: keyof LocaleModule) => void;\n  }\n  export const useLocale: () => UseLocaleReturn
              `
            ]
          }
        }
      );
    }

  });
};

