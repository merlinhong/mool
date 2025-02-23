const {
  ElementPlusResolver,
} = require("unplugin-vue-components/resolvers");
const Components = require("unplugin-vue-components/vite").default;
module.exports = (api, options) => {
  api.chainVite((config) => {
    config.plugins.push(
      Components({
        resolvers: [ElementPlusResolver()],
        dts: "components.d.ts",
      })
    );
  });
};
