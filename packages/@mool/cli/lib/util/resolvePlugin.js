const pluginRE = /^(@mooljs\/|mooljs-|@[\w-]+(\.)?[\w-]+\/mooljs-)plugin-/;
// const scopeRE = /^@[\w-]+(\.)?[\w-]+\//;
const officialRE = /^@mooljs\//
const officialPlugins = [
  "eslint",
  "router",
  "pinia",
  "ep",
  "antd",
  "arco"
];
exports.isPlugin = id => pluginRE.test(id)
exports.isOfficialPlugin = (id) => exports.isPlugin(id) && officialRE.test(id);
exports.resolvePluginId = (id) => {
  // already full id
  // e.g. vue-cli-plugin-foo, @vue/cli-plugin-foo, @bar/vue-cli-plugin-foo
  if (pluginRE.test(id)) {
    return id;
  }

  if (id === "@mooljs/cli-service") {
    return id;
  }

  if (officialPlugins.includes(id)) {
    return `@mooljs/plugin-${id}`;
  }
  // scoped short
  // e.g. @vue/foo, @bar/foo
//   if (id.charAt(0) === "@") {
//     const scopeMatch = id.match(scopeRE);
//     if (scopeMatch) {
//       const scope = scopeMatch[0];
//       const shortId = id.replace(scopeRE, "");
//       return `${scope}${scope === "@mooljs/" ? `` : `mool-`}cli-plugin-${shortId}`;
//     }
//   }
  // default short
  // e.g. foo
  return `mooljs-plugin-${id}`;
};
