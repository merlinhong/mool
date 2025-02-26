const {resolve} = require('path');
const fs = require('fs');
module.exports = (api, { config, lintOn = [] }, rootOptions, invoking) => {
  api.injectImports(api.entryFile, `import ep from 'element-plus';\nimport "element-plus/dist/index.css";`);
  api.transformScript(api.entryFile, require("./injectUseEp"));
  const editorConfigTemplatePath = resolve(__dirname, `./template/JSX/_module.d.ts`);
  if (fs.existsSync(editorConfigTemplatePath)) {
    if (fs.existsSync(api.resolve('types/module.d.ts'))) {
      // Append to existing .editorconfig
      api.render(files => {
        const editorconfig = fs.readFileSync(editorConfigTemplatePath, 'utf-8')
        files['types/module.d.ts'] += `\n${editorconfig}`
      })
    } else {
      api.render(`./template/JSX/_module.d.ts`)
    }
  }
};
