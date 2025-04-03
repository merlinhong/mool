const StorePlugin = require("./plugins/store");
module.exports = (api, options) => {
  api.chainVite((config) => {
    config.plugins.push(
      StorePlugin(api,options)
    );
  });
};

