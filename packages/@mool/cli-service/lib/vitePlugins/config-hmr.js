const colors = require("picocolors");
module.exports = function vitePluginConfigHMR(sources,onHotUpdate ) {
const RESTART_LIST = ['src/access.ts','src/app.tsx'];
  return {
    name: 'vite-plugin-config-hmr',
    handleHotUpdate(ctx) {
      for (const _path of sources) {
        const shouldHotUpdate = (file) => file.includes(_path)
        if (shouldHotUpdate(ctx.file)) {
          if(RESTART_LIST.includes(_path)){
            console.log(
              `${colors.cyanBright(`[vite]`)} ${colors.greenBright(`${_path} changed`)}`,
            )
            onHotUpdate(true);
          }else{
            console.log(
              `${colors.cyanBright(`[vite]`)} ${colors.greenBright(`${_path} changed, restarting server...`)}`,
            )
            onHotUpdate();
          }
          
        }
      }
     
    },

  }
}