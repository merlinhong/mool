module.exports = (api, options = {}, rootOptions = {}) => {
  api.extendPackage({
    dependencies: {
      "windicss": "^3.5.6"
    },
  });
  api.render("./template");
};
