import { ServicePlugin } from '@mooljs/cli-service'

const servicePlugin: ServicePlugin = (api, options) => {
  const version = api.version
  api.assertVersion(4)
  api.assertVersion('^100')
  api.getCwd()
  api.resolve('src/main.js')
  api.hasPlugin('eslint')
  api.registerCommand(
    'lint',
    {
      description: 'lint and fix source files',
      usage: 'vue-cli-service lint [options] [...files]',
      options: {
        '--format [formatter]': 'specify formatter (default: stylish)'
      },
      details: 'For more options, see https://eslint.org/docs/user-guide/command-line-interface#options'
    },
    async args => {
      await require('./lint')(args, api)
    }
  )
  api.registerCommand('lint', args => {})

  api.chainVite(webpackConfig => {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
     
    }
  })

  api.configureVite(config => {
   
  })

  api.configureVite(config => {
    
  })

  api.resolveViteConfig()

  api.resolveViteConfig(api.resolveChainableViteConfig())

  
}
export = servicePlugin
