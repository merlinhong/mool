const { createHtmlPlugin } = require("vite-plugin-html");
const path = require("path");
const fs = require("fs").promises;
const viteRestart = require("vite-plugin-restart").default;
const {
  injectWindicssImport,
} = require("@mooljs/cli-service/lib/util/injectWindicssImport");
const virtual = require("@mooljs/cli-service/lib/preset/app/plugins/mount.js");
const relative = (_path,relative)=>{
  return path.relative(
    process.cwd(),
    path.resolve(relative?process.cwd():__dirname, _path),
  )
}
module.exports = (api, options) => {
  injectWindicssImport(
    path.resolve(__dirname, "./main.js"),
    `import 'virtual:windi.css';`,
    options,
  );

  api.chainVite((config) => {
    config.plugins.push(
      {
        name: "vite-plugin-main",
        enforce: "pre",
        async transform(code, id, _options) {
          if (id.includes('router/index.js')) {
            return options.history == 'browser' ? await fs.readFile(relative("./router/index.tmpl"), "utf-8") : code;
          }
          return code
        },
      },
      virtual(options),
      viteRestart({
        reload: ["src/app.tsx"],
        restart:["src/app.tsx"],
      }),
      createHtmlPlugin({
        // template:'index.html',
        template: relative("index.html"),
        inject: {
          data: {
            entry: `/${relative("main.js")}`,
            title: options.title || "My MoolJs App",
          },
        },
      }),
    );
  });
};
