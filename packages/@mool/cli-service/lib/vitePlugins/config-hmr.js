const colors = require("picocolors");
module.exports = function vitePluginConfigHMR(sources,onHotUpdate ) {

  return {
    name: 'vite-plugin-config-hmr',
    handleHotUpdate(ctx) {
      for (const _path of sources) {
        const shouldHotUpdate = (file) => file.includes(_path)
        if (shouldHotUpdate(ctx.file)) {
          console.log(
            `${colors.cyanBright(`[vite]`)} ${colors.greenBright(`${_path} changed, restarting server...`)}`,
          )
          onHotUpdate();
        }
      }
     
    },
  }
}