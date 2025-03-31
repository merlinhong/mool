const colors = require("picocolors");
const RESTART_LIST = ['src/access.ts'];
// const chokidar = require('chokidar');
// for (const path of RUNTIME_PATH) {
//   const watcher = chokidar.watch(path);
//   watcher.on('change', (file) => {
//     watcher.unwatch(path)
//     server.ws.send({ type: 'full-reload' });
//   });
// }
module.exports = function vitePluginConfigHMR(sources, onHotUpdate) {
  const RUNTIME_PATH = ['src/app.tsx', 'src/access.ts'];
  return {
    name: 'vite-plugin-config-hmr',
    handleHotUpdate(ctx) {
      for (const _path of sources) {
        if (RUNTIME_PATH.includes(_path)) return ctx.modules
        const shouldHotUpdate = (file) => file.includes(_path)
        if (shouldHotUpdate(ctx.file)) {
          if (RESTART_LIST.includes(_path)) {
            console.log(
              `${colors.cyanBright(`[vite]`)} ${colors.greenBright(`${_path} changed`)}`,
            )
            onHotUpdate(true);
          } else {
            console.log(
              `${colors.cyanBright(`[vite]`)} ${colors.greenBright(`${_path} changed, restarting server...`)}`,
            )
            onHotUpdate();
          }
        }
      }
    }
  }
}