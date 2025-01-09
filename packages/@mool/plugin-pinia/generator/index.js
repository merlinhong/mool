module.exports = (api, options = {}, rootOptions = {}) => {
  api.injectImports(api.entryFile, `import store from './store'`);
  api.transformScript(api.entryFile, require("./injectUseStore"));
  api.extendPackage({
    dependencies: {
      "pinia": "^2.1.7",
    },
  });
  api.render("./template");
};
