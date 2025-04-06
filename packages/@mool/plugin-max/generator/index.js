module.exports = (api, { config, lintOn = [] }, rootOptions, invoking) => {
  api.extendPackage({
    dependencies: {
      mooljs: "^1.0.1",
    },
  });

  api.render("./template");
};
