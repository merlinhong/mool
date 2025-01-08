module.exports = (api, options) => {
  api.render('./template', {
    doesCompile: api.hasPlugin('babel') || api.hasPlugin('typescript'),
  })

  api.extendPackage({
    dependencies: {
      'vue': '^3.2.25'
    }
  })
  api.extendPackage({
    scripts: {
      'serve': 'mool-cli-service serve',
      'build': 'mool-cli-service build'
    },
    browserslist: [
      '> 1%',
      'last 2 versions',
      'not dead',
      'not ie 11'
    ]
  })

  if (options.cssPreprocessor) {
    const deps = {
      sass: {
        sass: '^1.32.7',
      },
      'dart-sass': {
        sass: '^1.32.7',
      },
      less: {
        'less': '^4.0.0',
      },
      stylus: {
        'stylus': '^0.55.0',
      }
    }

    api.extendPackage({
      devDependencies: deps[options.cssPreprocessor]
    })
  }

  // for v3 compatibility
  if (options.pinia && !api.hasPlugin('pinia')) {
    require('./pinia')(api, options, options)
  }

  // additional tooling configurations
  if (options.configs) {
    api.extendPackage(options.configs)
  }

  // Delete jsconfig.json when typescript
  if (api.hasPlugin('typescript')) {
    api.render((files) => delete files['jsconfig.json'])
  }
}
