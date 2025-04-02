const { createHtmlPlugin } = require("vite-plugin-html");
const viteRestart = require("vite-plugin-restart").default;
const Mount = require("@mooljs/cli-service/lib/vitePlugins/mount");
const relative = require("@mooljs/cli-service/lib/util/getRelativeUrl");
const path = require('path');
let maxPlugin = checkMaxPlugin();
function checkMaxPlugin() {
  try {
    require.resolve('@mooljs/plugin-max');
    return true;
  } catch (err) {
    return false;
  }
};
module.exports = (api, options) => {
  api.chainVite((config) => {
    config.plugins.push(
      !maxPlugin && Mount(api, options),
      viteRestart({
        reload: ['src/locale', 'src/app.tsx'],
        restart: ['src/locale', 'src/store'],
      }),
      createHtmlPlugin({
        // template:'index.html',
        template: relative(path.join(__dirname, "index.html")),
        inject: {
          data: {
            entry: `/${relative(path.join(__dirname, "main.jsx"))}`,
            title: options.title || "My MoolJs App",
          },
        },
      }),
    );
  });
};
