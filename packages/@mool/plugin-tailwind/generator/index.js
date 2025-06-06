module.exports = (api, options = {}, rootOptions = {}) => {
  api.extendPackage({
    dependencies: {
      "tailwindcss": "^4.1.6",
      "tailwindcss-primeui": "^0.6.1",
    },
  });
  api.render("./template");
};
