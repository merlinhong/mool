module.exports = (api, { config, lintOn = [] }, rootOptions, invoking) => {
  api.extendPackage({
    dependencies: {
      mooljs: "^1.0.0-beta",
    },
  });

  api.render("./template");
};
