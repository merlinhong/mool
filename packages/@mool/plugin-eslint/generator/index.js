module.exports = (api, { config, lintOn = [] }, rootOptions, invoking) => {
  const eslintConfig = require('../eslintOptions').config(api, config, rootOptions)
  const devDependencies = require('../eslintDeps').getDeps(api, config, rootOptions)

  const pkg = {
    scripts: {
      lint: 'mool lint'
    },
    devDependencies
  }

  // const editorConfigTemplatePath = path.resolve(__dirname, `./template/${config}/_editorconfig`)
  // if (fs.existsSync(editorConfigTemplatePath)) {
  //   if (fs.existsSync(api.resolve('.editorconfig'))) {
  //     // Append to existing .editorconfig
  //     api.render(files => {
  //       const editorconfig = fs.readFileSync(editorConfigTemplatePath, 'utf-8')
  //       files['.editorconfig'] += `\n${editorconfig}`
  //     })
  //   } else {
  //     api.render(`./template/${config}`)
  //   }
  // }
  if(config=='antfu'){
    api.render(`./template/antfu`)
  }else{
    api.render(`./template/eslint`)

  }

  if (typeof lintOn === 'string') {
    lintOn = lintOn.split(',')
  }

  
  if (lintOn.includes('commit')) {
    Object.assign(pkg.devDependencies, {
      'lint-staged': '^11.1.2'
    })
    pkg.gitHooks = {
      'pre-commit': 'lint-staged'
    }
    const extensions = require('../eslintOptions').extensions(api)
      .map(ext => ext.replace(/^\./, '')) // remove the leading `.`
    pkg['lint-staged'] = {
      [`*.{${extensions.join(',')}}`]: 'mool lint'
    }
  }

  api.extendPackage(pkg)

  // invoking only
  if (invoking) {
    if (api.hasPlugin('unit-mocha')) {
      // eslint-disable-next-line node/no-extraneous-require
      require('@vue/cli-plugin-unit-mocha/generator').applyESLint(api)
    } else if (api.hasPlugin('unit-jest')) {
      // eslint-disable-next-line node/no-extraneous-require
      require('@vue/cli-plugin-unit-jest/generator').applyESLint(api)
    }
  }

  // lint & fix after create to ensure files adhere to chosen config
  // for older versions that do not support the `hooks` feature
  // try {
  //   api.assertCliVersion('^4.0.0-beta.0')
  // } catch (e) {
  //   if (config && config !== 'base') {
  //     api.onCreateComplete(async () => {
  //       await require('../lint')({ silent: true }, api)
  //     })
  //   }
  // }
}

