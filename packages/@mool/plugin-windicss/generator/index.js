module.exports = (api, options = {}, rootOptions = {}) => {
  api.injectImports(api.entryFile, `import 'virtual:windi.css'`);
  api.extendPackage({
    dependencies: {
      "windicss": "^3.5.6"
    },
  });
  api.render("./template");
};
