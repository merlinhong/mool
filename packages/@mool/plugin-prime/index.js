const Components = require("unplugin-vue-components/vite").default;
module.exports = (api, options) => {
  api.chainVite(async (config) => {
    const { PrimeVueResolver } = await import("@primevue/auto-import-resolver");
    config.plugins.push(
      Components({
        resolvers: [PrimeVueResolver()],
        dts: "types/components.d.ts",
      }),
    );
  });
};
