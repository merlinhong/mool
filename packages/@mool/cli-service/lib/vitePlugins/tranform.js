const {existsSync,readFileSync} = require("fs");
const relative = require("@mooljs/cli-service/lib/util/getRelativeUrl");
module.exports = function tranform(options){
    return {
        name: "vite-mooljs-plugin-main",
        enforce: "pre",
        async transform(code, id, _options) {
          if (id.includes('main.js')) {
            const lines = code.split("\n");
            if(existsSync(relative("./src/locale",true))){
              lines.splice(0, 0, `import setupI18n from "./plugins/i18n.js";`);
              const targetIndex = lines.findIndex((line) => line.includes("app.mount"));
              lines.splice(targetIndex, 0, `setupI18n(app,${options.locale??'{}'});`);
              
            }
            if(options.windicss){
              lines.splice(0, 0, `import 'virtual:windi.css';`);
            }
            return {
              code: lines.join("\n"),
              map: null,
            };
          }
          return code
        },
      }
}