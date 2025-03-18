module.exports = (api, { config, lintOn = [] }, rootOptions, invoking) => {
  api.extendPackage({
    dependencies: {
      "vue-i18n": "^11.1.2",
    },
  });

  api.render("./template");
};
