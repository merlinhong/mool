const merge = require("lodash.merge");
const vueJsx = require("@vitejs/plugin-vue-jsx").default;
const vue = require("@vitejs/plugin-vue").default;
const path = require("path");
module.exports = (api, options) => {
  api.chainVite((config) => {
    config.plugins.push(
      vue(merge({}, options.vue ?? {})),
      vueJsx(merge({}, options.vueJsx ?? {}))
    );
  });
};
