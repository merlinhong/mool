const { createHtmlPlugin } = require("vite-plugin-html");
const path = require("path");
const {existsSync,readFileSync} = require("fs");
const viteRestart = require("vite-plugin-restart").default;
const {
  injectWindicssImport,
} = require("@mooljs/cli-service/lib/util/injectWindicssImport");
const virtual = require("@mooljs/cli-service/lib/preset/app/plugins/mount");
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
            return options.history == 'browser' ? readFileSync(relative("./router/index.tmpl"), "utf-8") : code;
          }
          if (id.includes('main.js')) {
            if(existsSync(relative("./src/locale",true))){
              const lines = code.split("\n");
              lines.splice(0, 0, `import setupI18n from "./i18n.js";`);
              const targetIndex = lines.findIndex((line) => line.includes("app.mount"));
              lines.splice(targetIndex, 0, `setupI18n(app,${options.locale??'{}'});`);
              return {
                code: lines.join("\n"),
                map: null,
              };
            }
            
          }
          return code
        },
      },
      virtual(options),
      viteRestart({
        reload:['src/app.tsx'],
        restart: ["src/app.tsx"],
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
