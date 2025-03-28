const Layout = require("vite-plugin-vue-layouts").default;
const TranformPlugin = require("@mooljs/cli-service/lib/vitePlugins/tranform");
const RouterPlugin = require("@mooljs/cli-service/lib/vitePlugins/router");
const windicss = require("vite-plugin-windicss").default;
const {
  ElementPlusResolver,
} = require("unplugin-vue-components/resolvers");
const Components = require("unplugin-vue-components/vite").default;
module.exports = (api, options) => {
  api.chainVite((config) => {
    config.plugins.push(
      TranformPlugin(api,options),
      RouterPlugin(api,options),
      Layout(options.layout ?? {
        layoutsDir: path.resolve(__dirname,"../plugin-layout/layouts"),
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: "types/components.d.ts",
      })
    );
    if (options.windicss) {
      config.plugins.push(windicss());
    }
  });
};

