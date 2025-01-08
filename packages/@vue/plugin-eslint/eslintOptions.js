exports.config = (api, preset, rootOptions = {}) => {
  const config = {
    root: true,
    env: {
      browser: true, // 允许使用浏览器环境中的全局变量，如 window 和 document
      es2021: true, // 支持 ECMAScript 2021 的语法
    },
    extends: [
      "eslint:recommended", // 继承 ESLint 的推荐规则
      "plugin:vue/vue3-essential", // 继承 Vue 的基础规则集，适用于 Vue.js 项目
      "plugin:@typescript-eslint/recommended", // 继承 TypeScript 的推荐规则集，适用于 TypeScript 项目
      "plugin:prettier/recommended",
      "@vue/typescript/recommended"
    ],
    parserOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      "no-console": makeJSOnlyValue(
        `process.env.NODE_ENV === 'production' ? 'warn' : 'off'`
      ),
      "no-debugger": makeJSOnlyValue(
        `process.env.NODE_ENV === 'production' ? 'warn' : 'off'`
      ),
    },
  };

  config.parserOptions = {
    ecmaVersion: 12, // 指定 ECMAScript 版本为 12（ES2021）
    parser: "@typescript-eslint/parser", // 使用 @typescript-eslint/parser 解析 TypeScript 代码
    sourceType: "module", // 指定使用 ES 模块的模块系统
  };

  return config;
};

// __expression is a special flag that allows us to customize stringification
// output when extracting configs into standalone files
function makeJSOnlyValue(str) {
  const fn = () => {};
  fn.__expression = str;
  return fn;
}

const baseExtensions = [".js", ".jsx", ".vue"];
exports.extensions = (api) =>
  api.hasPlugin("typescript")
    ? baseExtensions.concat(".ts", ".tsx")
    : baseExtensions;
