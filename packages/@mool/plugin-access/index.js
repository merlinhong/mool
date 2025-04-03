const AccessPlugin = require("./plugins/access");
module.exports = (api, options) => {
  api.chainVite((config) => {
    config.plugins.push(
        AccessPlugin(api,options)
    );
  });
};

