const DEPS_MAP = {
  base: {
    eslint: "^8.56.0",
    "eslint-plugin-vue": "^9.20.1",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-prettier": "^5.1.3",
    prettier: "^3.2.4",
  },
  antfu: {
    '@antfu/eslint-config': "^1.0.0",
  },
  typescript: {
    "@vue/eslint-config-typescript": "^9.1.0",
    "@typescript-eslint/eslint-plugin": "^6.19.1",
    "@typescript-eslint/parser": "^6.19.1",
  },
};

exports.DEPS_MAP = DEPS_MAP;

exports.getDeps = function (api, preset, rootOptions = {}) {
  const deps = Object.assign({}, DEPS_MAP.base, DEPS_MAP[preset]);
  Object.assign(deps, DEPS_MAP.typescript);

  return deps;
};
