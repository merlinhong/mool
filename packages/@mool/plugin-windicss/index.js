const windicss = require("vite-plugin-windicss").default;
module.exports = (api, options) => {
  api.chainVite((config) => {
    if (options.windicss) {
      config.plugins.push(windicss());
    }
  });
};
