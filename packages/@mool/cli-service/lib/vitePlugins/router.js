const { existsSync, readFileSync } = require("fs");
const browserCode = 
` import { createRouter, createWebHistory,RouterView} from 'vue-router';
  import routes from '~pages';
  const router = createRouter({
      history: createWebHistory(),
      routes,
  });
  export default router;
  export {RouterView}
`
module.exports = function tranform(api,options) {
  return {
    name: "vite-mooljs-plugin-router",
    enforce: "pre",
    async transform(code, id, _options) {
      if (id.includes("router/index.js")) {
        code =
          options.history == "browser"
            ? browserCode
            : code;
        const lines = code.split("\n");
        if (existsSync(api.resolve("src/layouts"))) {
          lines.splice(
            0,
            0,
            `import { setupLayouts } from 'virtual:generated-layouts'`,
          );
          const targetIndex = lines.findIndex((line) =>
            line.includes("routes,"),
          );
          lines.splice(targetIndex, 1, `routes: setupLayouts(routes)`);
          return {
            code: lines.join("\n"),
            map: null,
          };
        } else {
          return { code, map: null };
        }
      }

      return code;
    },
  };
};
