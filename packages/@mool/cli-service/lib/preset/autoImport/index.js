const AutoImport = require("unplugin-auto-import/vite").default;
const mergeWith = require("lodash.mergeWith");
const customizer = (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    // 合并数组
    return objValue.concat(srcValue);
  }
};
module.exports = (api, options) => {
  const autoImportPluginOption = {
    imports: [
      "vue",
      "vue-router",
      {
        [`@/service/index`]: ["service"],
      },
    ],
    dts: "types/auto-imports.d.ts",
  };
  api.chainVite((config) => {
    config.plugins.push(
      AutoImport(mergeWith(autoImportPluginOption, options.autoImport, customizer))
    );
  });
};
