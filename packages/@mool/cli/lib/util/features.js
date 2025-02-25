const { chalk, toShortPluginId } = require("@vue/cli-shared-utils");

exports.getFeatures = (preset) => {
  const features = [];
  if (preset.router) {
    features.push("router");
  }
  if (preset.vuex) {
    features.push("vuex");
  }
  if (preset.cssPreprocessor) {
    features.push(preset.cssPreprocessor);
  }
  const plugins = Object.keys(preset.plugins).filter((dep) => {
    return dep !== "@vue/cli-service";
  });
  features.push.apply(features, plugins);
  return features;
};
const opt = {
  CP: "uni",
  Desktop: "electron",
};
exports.formatFeatures = (preset, name) => {
  const versionInfo = chalk.yellow(
    `[Vue 3${opt[name] ? " + " + opt[name] : ""}] typescript, `
  );
  const features = exports.getFeatures(preset);

  return (
    versionInfo +
    features
      .map((dep) => {
        return chalk.yellow(dep);
      })
      .join(", ")
  );
};
