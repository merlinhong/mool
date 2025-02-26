const AutoImport = require("unplugin-auto-import/vite").default;
const {
  ElementPlusResolver,
  AntDesignVueResolver,
  ArcoResolver,
} = require("unplugin-vue-components/resolvers");
const path = require("path");
const resolvers = {
  ep: ElementPlusResolver(),
  antd: AntDesignVueResolver(),
  arco: ArcoResolver(),
}
module.exports = (api, options) => {
  const autoImportPluginOption = {
    imports: [
      "vue",
      "vue-router",
      {
        [`/src/service/index`]: ["service"],
      },
    ],
    dts: "types/auto-imports.d.ts",
    resolvers: options.autoImport?.map((item) => resolvers[item]),

  };
  api.chainVite((config) => {
    config.plugins.push(
      AutoImport(autoImportPluginOption)
    );
  });
};
