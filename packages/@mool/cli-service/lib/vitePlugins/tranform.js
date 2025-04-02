const {existsSync,readFileSync} = require("fs");
module.exports = function tranform(api,options){
    return {
        name: "vite-mooljs-plugin-main",
        enforce: "pre",
        async transform(code, id, _options) {
          if (id.includes('main.js')) {
            const lines = code.split("\n");
            if(existsSync(api.resolve("src/locale"))){
              lines.splice(0, 0, `import setupI18n from "./plugins/i18n.js";`);
              const targetIndex = lines.findIndex((line) => line.includes("app.mount"));
              lines.splice(targetIndex, 0, `setupI18n(app,${JSON.stringify(options.locale??{})});`);
              
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