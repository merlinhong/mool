module.exports = (api, { config, lintOn = [] }, rootOptions, invoking) => {
  api.extendPackage({
    dependencies: {
      mooljs: "^0.7.0",
    },
  });

  api.render("./template");
};
