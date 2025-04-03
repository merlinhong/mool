const {readFileSync} = require('node:fs');
module.exports = function virtual(api, options) {
  const virtualModuleIds = ['virturl:access'];
  return {
    name: "vite-mooljs-virturl-access",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 页面刷新时触发
        if (req.url == "/@vite/client") {
          // 重新加载虚拟模块
          virtualModuleIds.forEach((vm) => {
            const mod = server.moduleGraph.getModuleById(`\0${vm}`);
            if (mod) {
              server.moduleGraph.invalidateModule(mod);
            }
          });
        }
        next();
      });
    },

    resolveId(id) {
      if (virtualModuleIds.includes(id)) {
        return "\0" + id;
      }
    },
    async load(id) {
      if(id=="\0virturl:access"){
        return readFileSync(api.resolve('node_modules/@mooljs/plugin-access/dist/access.mjs'),'utf-8');
      }
    },
  };
}