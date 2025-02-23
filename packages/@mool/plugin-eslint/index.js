const eslintVitePlugin = require('vite-plugin-eslint').default

/** @type {import('@mooljs/cli-service').ServicePlugin} */
module.exports = (api, options) => {
  if (options.lintOnSave) {
    api.chainVite(viteConfig => {
      viteConfig.plugins.push(eslintVitePlugin(options.eslint??{}))
    })
  }
  
  api.registerCommand(
    'lint',
    {
      description: 'lint and fix source files',
      usage: 'mool lint [options] [...files]',
      options: {
        '--format [formatter]': 'specify formatter (default: stylish)',
        '--no-fix': 'do not fix errors or warnings',
        '--no-fix-warnings': 'fix errors, but do not fix warnings',
        '--max-errors [limit]':
          'specify number of errors to make build failed (default: 0)',
        '--max-warnings [limit]':
          'specify number of warnings to make build failed (default: Infinity)',
        '--output-file [file_path]':
          'specify file to write report to'
      },
      details:
        'For more options, see https://eslint.org/docs/user-guide/command-line-interface#options'
    },
    async args => {
      await require('./lint')(args, api)
    }
  )
}
