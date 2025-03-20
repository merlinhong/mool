const colors = require("picocolors");
module.exports = function vitePluginConfigHMR(sources,onHotUpdate ) {

  return {
    name: 'vite-plugin-config-hmr',
    handleHotUpdate(ctx) {
      const shouldHotUpdate = (file) => file.includes(sources)
      if (shouldHotUpdate(ctx.file)) {
        console.log(
          `${colors.cyanBright(`[vite]`)} ${colors.greenBright(`${sources} changed, restarting server...`)}`,
        )
        onHotUpdate();
      }
    },
  }
}