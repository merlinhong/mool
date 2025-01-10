const svgLoader = require("vite-svg-loader").default;
module.exports = (api, options) => {
  api.chainVite((config) => {
    options.svgc &&
      config.plugins.push(svgLoader({ svgoConfig: {}, svgo: !!options.svgo }));
  });
};
