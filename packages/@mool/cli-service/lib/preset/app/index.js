const { createHtmlPlugin } = require("vite-plugin-html");
const viteRestart = require("vite-plugin-restart").default;
const virtual = require("@mooljs/cli-service/lib/vitePlugins/mount");
const relative = require("@mooljs/cli-service/lib/util/getRelativeUrl");
const path = require('path');
module.exports = (api, options) => {
  api.chainVite((config) => {
    config.plugins.push(
      virtual(api,options),
      viteRestart({
        reload:['src/locale'],
        restart: ['src/locale'],
      }),
      createHtmlPlugin({
        // template:'index.html',
        template: relative(path.join(__dirname,"index.html")),
        inject: {
          data: {
            entry: `/${relative(path.join(__dirname,"main.jsx"))}`,
            title: options.title || "My MoolJs App",
          },
        },
      }),
    );
  });
};
