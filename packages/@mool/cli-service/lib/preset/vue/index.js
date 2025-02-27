const merge = require("lodash.merge");
const vueJsx = require("@vitejs/plugin-vue-jsx").default;
const vue = require("@vitejs/plugin-vue").default;
const {createHtmlPlugin} = require( 'vite-plugin-html');
const path = require("path");
const {injectImport} = require('../../util/injectImport')
module.exports = (api, options) => {
  if(options.windicss){
    injectImport('../../main.js', `import 'virtual:windi.css';`);
  }
  api.chainVite((config) => {
    config.plugins.push(
      vue(merge({}, options.vue ?? {})),
      vueJsx(merge({}, options.vueJsx ?? {})),
      createHtmlPlugin({
        entry:path.resolve(__dirname, '../../../main.js'),
        template: path.resolve(__dirname, '../../../index.html')
      })
    );
  });
};
