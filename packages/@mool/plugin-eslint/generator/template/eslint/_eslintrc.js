module.exports = {
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
    "@vue/typescript/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12, // 指定 ECMAScript 版本为 12（ES2021）
    parser: "@typescript-eslint/parser", // 使用 @typescript-eslint/parser 解析 TypeScript 代码
    sourceType: "module", // 指定使用 ES 模块的模块系统
  },
  plugins: ['@typescript-eslint','prettier'],
  rules: {
    "no-console": `process.env.NODE_ENV === 'production' ? 'warn' : 'off'`,
    "no-debugger": `process.env.NODE_ENV === 'production' ? 'warn' : 'off'`,
    'prettier/prettier': 1,
    // Vue: Recommended rules to be closed or modify
    'vue/require-default-prop': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': 0,
    // Vue: Add extra rules
    'vue/custom-event-name-casing': [2, 'camelCase'],
    'vue/no-v-text': 1,
    'vue/padding-line-between-blocks': 1,
    'vue/require-direct-export': 1,
    'vue/multi-word-component-names': 0,
    // Allow @ts-ignore comment
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-empty-function': 1,
    '@typescript-eslint/no-explicit-any': 0,
    'import/extensions': [
      2,
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
