module.exports = (api, options) => {
  api.chainVite(async(config) => {
    const tailwind = await import('@tailwindcss/vite')
    if (options.tailwind) {
      config.plugins.push(tailwind());
    }
  });
  api.applyPlugins((config) => {
    // 插件逻辑
    config.plugins.push(
      {
        name: '@mooljs/plugin-tailwind',
        after:[],
        injectImports: (opt) => {
          return [options.tailwind?`import '/src/assets/styles/tailwind.css';`:''];
        }
      }
    );
  });
};
