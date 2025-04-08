const tranform = require("@mooljs/cli-service/lib/vitePlugins/tranform");
module.exports = (api, options) => {
  api.chainVite((config) => {
    config.plugins.push(
      tranform(api,options),
    )
  });
};
