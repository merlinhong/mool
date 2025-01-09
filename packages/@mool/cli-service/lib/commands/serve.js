const {
  info,
  error,
  hasProjectYarn,
  hasProjectPnpm,
  IpcMessenger
} = require('@vue/cli-shared-utils')
const getBaseUrl = require('../util/getBaseUrl')

const defaults = {
  host: '0.0.0.0',
  port: 8080,
  https: false
}

/** @type {import('@mooljs/cli-service').ServicePlugin} */
module.exports = (api, options) => {
  const baseUrl = getBaseUrl(options)
  api.registerCommand('serve', {
    description: 'start development server',
    usage: 'mool-cli-service serve [options] [entry]',
    options: {
      '--open': `open browser on server start`,
      '--copy': `copy url to clipboard on server start`,
      '--stdin': `close when stdin ends`,
      '--mode': `specify env mode (default: development)`,
      '--host': `specify host (default: ${defaults.host})`,
      '--port': `specify port (default: ${defaults.port})`,
      '--https': `use https (default: ${defaults.https})`,
      '--public': `specify the public network URL for the HMR client`,
      '--skip-plugins': `comma-separated list of plugin names to skip for this run`
    }
  }, async function serve (args) {
    info('Starting development server...')
    const isInContainer = checkInContainer()
    const isProduction = process.env.NODE_ENV === 'production'
    const { chalk } = require('@vue/cli-shared-utils')
    const prepareURLs = require('../util/prepareURLs')
    const isAbsoluteUrl = require('../util/isAbsoluteUrl')
   
    // Vite server logic
    const { createServer } = require('vite');
    const finalConfig = api.resolveViteConfig();
    const viteServer = await createServer(finalConfig)

    await viteServer.listen()

    const urls = prepareURLs(
      'http',
      args.host || defaults.host,
      args.port || defaults.port,
      isAbsoluteUrl(baseUrl) ? '/' : baseUrl
    )

    console.log(`Vite server running at: ${chalk.blue(urls.localUrlForBrowser)}`)

    return new Promise((resolve) => {
      resolve({
        server: viteServer,
        url: urls.localUrlForBrowser
      })
    })
  })
}

function checkInContainer () {
  if ('CODESANDBOX_SSE' in process.env) {
    return true
  }
  const fs = require('fs')
  if (fs.existsSync(`/proc/1/cgroup`)) {
    const content = fs.readFileSync(`/proc/1/cgroup`, 'utf-8')
    return /:\/(lxc|docker|kubepods(\.slice)?)\//.test(content)
  }
}

module.exports.defaultModes = {
  serve: 'development'
}