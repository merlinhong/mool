import { createI18n } from 'vue-i18n';
const modules = {} ;

/**
 * 加载store下的所有命名空间模块，不支持嵌套定义
 */
(() => {
  // 自动导入所有模块
  const moduleFiles = import.meta.glob(
    "/src/locale/*.ts",
    { eager: true },
  );

  for (const path in moduleFiles) {
    const moduleName = path.match(/([^/]+)\.ts$/)?.[1];
    if (moduleName) {
      modules[moduleName] = moduleFiles[path].default;
    }
  }
})()
export const LOCALE_OPTIONS = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
];
const defaultLocale = localStorage.getItem('mooljs-locale') || 'zh-CN';


export default function (app, options)  {
    app.use(createI18n({
        locale: defaultLocale,
        fallbackLocale: 'en-US',
        legacy: false,
        allowComposition: true,
        messages: {
          'en-US': modules.en,
          'zh-CN': modules.cn,
        },
        ...options,
      }))
};
