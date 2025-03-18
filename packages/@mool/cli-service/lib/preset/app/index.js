const { createHtmlPlugin } = require("vite-plugin-html");
const viteRestart = require("vite-plugin-restart").default;
const virtual = require("@mooljs/cli-service/lib/vitePlugins/mount");
const tranform = require("@mooljs/cli-service/lib/vitePlugins/tranform");
const relative = require("@mooljs/cli-service/lib/util/getRelativeUrl");
const path = require('path');

console.log(relative(path.join(__dirname,"main.js")));
module.exports = (api, options) => {
  api.chainVite((config) => {
    config.plugins.push(
      tranform(options),
      virtual(options),
      viteRestart({
        reload:['src/app.tsx','src/locale'],
        restart: ["src/app.tsx",'src/locale'],
      }),
      createHtmlPlugin({
        // template:'index.html',
        template: relative(path.join(__dirname,"index.html")),
        inject: {
          data: {
            entry: `/${relative(path.join(__dirname,"main.js"))}`,
            title: options.title || "My MoolJs App",
          },
        },
      }),
    );
  });
};
