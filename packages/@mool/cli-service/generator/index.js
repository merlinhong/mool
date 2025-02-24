module.exports = (api, options) => {
  api.render("./template", {
    lintOn: options.lintOn,
    windicss:options.windicss
  });

  api.extendPackage({
    dependencies: {
      vue: "^3.2.25",
      mooljs: "^0.1.0-beta",
    },
    devDependencies:{
      "@types/node": "^20.11.6",
      "ts-node": "^10.9.2",
    }
  });
  api.extendPackage({
    scripts: {
      serve: "mool serve",
      build: "mool build",
    },
    browserslist: ["> 1%", "last 2 versions", "not dead", "not ie 11"],
  });

  if (options.cssPreprocessor) {
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
  }

  // for v3 compatibility
  if (options.pinia && !api.hasPlugin("pinia")) {
    require("./pinia")(api, options, options);
  }

  // additional tooling configurations
  if (options.configs) {
    api.extendPackage(options.configs);
  }
};
