const path = require('path')
const hash = require('hash-sum')
const { semver, matchesPluginId } = require('@vue/cli-shared-utils')

// Note: if a plugin-registered command needs to run in a specific default mode,
// the plugin needs to expose it via `module.exports.defaultModes` in the form
// of { [commandName]: mode }. This is because the command mode needs to be
// known and applied before loading user options / applying plugins.

class PluginAPI {
  /**
   * @param {string} id - Id of the plugin.
   * @param {Service} service - A vue-cli-service instance.
   */
  constructor (id, service) {
    this.id = id
    this.service = service
  }

  get version () {
    return require('../package.json').version
  }

  assertVersion (range) {
    if (typeof range === 'number') {
      if (!Number.isInteger(range)) {
        throw new Error('Expected string or integer value.')
      }
      range = `^${range}.0.0-0`
    }
    if (typeof range !== 'string') {
      throw new Error('Expected string or integer value.')
    }

    if (semver.satisfies(this.version, range, { includePrerelease: true })) return

    throw new Error(
      `Require @mooljs/cli-service "${range}", but was loaded with "${this.version}".`
    )
  }

  /**
   * Current working directory.
   */
  getCwd () {
    return this.service.context
  }

  /**
   * 
   * provide a methods to run serve command
   */
  run (key, defaultValue) {
    return this.service.run('serve');
  }


  /**
   * Resolve path for a project.
   *
   * @param {string} _path - Relative path from project root
   * @return {string} The resolved absolute path.
   */
  resolve (_path) {
    return path.resolve(this.service.context, _path)
  }

  /**
   * Check if the project has a given plugin.
   *
   * @param {string} id - Plugin id, can omit the (@vue/|vue-|@scope/vue)-cli-plugin- prefix
   * @return {boolean}
   */
  hasPlugin (id) {
    return this.service.plugins.some(p => matchesPluginId(id, p.id))
  }

  /**
   * Register a command that will become available as `vue-cli-service [name]`.
   *
   * @param {string} name
   * @param {object} [opts]
   *   {
   *     description: string,
   *     usage: string,
   *     options: { [string]: string }
   *   }
   * @param {function} fn
   *   (args: { [string]: string }, rawArgs: string[]) => ?Promise
   */
  registerCommand (name, opts, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = null
    }
    this.service.commands[name] = { fn, opts: opts || {} }
  }

  /**
   * Register a function that will receive a chainable max Plugins
   * the function is lazy and won't be called until `resolveMaxConfig` is
   * called
   * @param {function} fn 
   */
  applyPlugins(fn){
    this.service.maxPlugins.push(fn);
  }

  resolveMaxPlugins () {
    return this.service.resolveMaxPlugins()
  }

  /**
   * Register a function that will receive a chainable vite config
   * the function is lazy and won't be called until `resolveViteConfig` is
   * called
   *
   * @param {function} fn
   */
  chainVite (fn) {
    this.service.viteChainFns.push(fn)
  }

  /**
   * Register
   * - a vite configuration object that will be merged into the config
   * OR
   * - a function that will receive the raw vite config.
   *   the function can either mutate the config directly or return an object
   *   that will be merged into the config.
   *
   * @param {object | function} fn
   */
  configureVite (fn) {
    this.service.viteRawConfigFns.push(fn)
  }

  // /**
  //  * Register a dev serve config function. It will receive the express `app`
  //  * instance of the dev server.
  //  *
  //  * @param {function} fn
  //  */
  // configureDevServer (fn) {
  //   this.service.devServerConfigFns.push(fn)
  // }

  /**
   * Resolve the final raw vite config, that will be passed to vite.
   *
   * @param {ChainableWebpackConfig} [chainableConfig]
   * @return {object} Raw vite config.
   */
  resolveViteConfig (chainableConfig) {
    return this.service.resolveViteConfig(chainableConfig)
  }

  /**
   * Resolve an intermediate chainable vite config instance, which can be
   * further tweaked before generating the final raw vite config.
   * You can call this multiple times to generate different branches of the
   * base vite config.
   * See https://github.com/mozilla-neutrino/vite-chain
   *
   * @return {ChainableWebpackConfig}
   */
  resolveChainableViteConfig () {
    return this.service.resolveChainableViteConfig()
  }

  /**
   * Generate a cache identifier from a number of variables
   */
  genCacheConfig (id, partialIdentifier, configFiles = []) {
    const fs = require('fs')
    const cacheDirectory = this.resolve(`node_modules/.cache/${id}`)

    // replace \r\n to \n generate consistent hash
    const fmtFunc = conf => {
      if (typeof conf === 'function') {
        return conf.toString().replace(/\r\n?/g, '\n')
      }
      return conf
    }

    const variables = {
      partialIdentifier,
      'cli-service': require('../package.json').version,
      env: process.env.NODE_ENV,
      test: !!process.env.VUE_CLI_TEST,
      config: [
        fmtFunc(this.service.projectOptions.chainVite),
        fmtFunc(this.service.projectOptions.configureVite)
      ]
    }


    if (!Array.isArray(configFiles)) {
      configFiles = [configFiles]
    }
    configFiles = configFiles.concat([
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml'
    ])

    const readConfig = file => {
      const absolutePath = this.resolve(file)
      if (!fs.existsSync(absolutePath)) {
        return
      }

      if (absolutePath.endsWith('.js')) {
        // should evaluate config scripts to reflect environment variable changes
        try {
          return JSON.stringify(require(absolutePath))
        } catch (e) {
          return fs.readFileSync(absolutePath, 'utf-8')
        }
      } else {
        return fs.readFileSync(absolutePath, 'utf-8')
      }
    }

    variables.configFiles = configFiles.map(file => {
      const content = readConfig(file)
      return content && content.replace(/\r\n?/g, '\n')
    })

    const cacheIdentifier = hash(variables)
    return { cacheDirectory, cacheIdentifier }
  }
}

module.exports = PluginAPI
