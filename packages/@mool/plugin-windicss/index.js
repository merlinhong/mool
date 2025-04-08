const windicss = require("vite-plugin-windicss").default;
const { readFileSync, existsSync } = require('node:fs');

module.exports = (api, options) => {
  api.chainVite((config) => {
    if (options.windicss) {
      config.plugins.push(windicss());
    }
  });
  api.applyPlugins((config) => {
    // 插件逻辑
    config.plugins.push(
      {
        name: '@mooljs/plugin-windicss',
        after:[],
        injectImports: (opt) => {
          return [options.windicss?`import 'virtual:windi.css';`:''];
        }
      }
    );
  });
};
