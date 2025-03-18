module.exports = (api, options) => {
  api.render("./template", {
    lintOn: options.lintOn,
    title: "<%= title %>",
    entry: "<%= entry %>",
  });

  api.extendPackage({
    dependencies: {
      vue: "^3.2.25",
      mooljs: "^0.4.3",
      "vue-router": "^4.0.3",
    },
    devDependencies: {
      "@types/node": "^20.11.6",
      "ts-node": "^10.9.2",
      typescript: "^5.3.3",
    },
  });
  api.extendPackage({
    scripts: {
      serve: "mool serve",
      build: "mool build",
    },
    browserslist: ["> 1%", "last 2 versions", "not dead", "not ie 11"],
  });

  const deps = {
    sass: {
      sass: "^1.32.7",
    },
    "dart-sass": {
      sass: "^1.32.7",
    },
    less: {
      less: "^4.0.0",
    },
  };

  api.extendPackage({
    devDependencies: deps[options.cssPreprocessor],
  });

 
  // additional tooling configurations
  if (options.configs) {
    api.extendPackage(options.configs);
  }
};
