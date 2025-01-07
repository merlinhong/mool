const { createSchema, validate } = require('@vue/cli-shared-utils')

const schema = createSchema(joi => joi.object({
  publicPath: joi.string().allow(''),
  outputDir: joi.string(),
  assetsDir: joi.string().allow(''),
  indexPath: joi.string(),
  filenameHashing: joi.boolean(),
  runtimeCompiler: joi.boolean(),
  transpileDependencies: joi.alternatives().try(
    joi.boolean(),
    joi.array()
  ),
  productionSourceMap: joi.boolean(),
  parallel: joi.alternatives().try(
    joi.boolean(),
    joi.number().integer()
  ),
  devServer: joi.object(),
  pages: joi.object().pattern(
    /\w+/,
    joi.alternatives().try(
      joi.string().required(),
      joi.array().items(joi.string().required()),

      joi.object().keys({
        entry: joi.alternatives().try(
          joi.string().required(),
          joi.array().items(joi.string().required())
        ).required()
      }).unknown(true)
    )
  ),
  crossorigin: joi.string().valid('', 'anonymous', 'use-credentials'),
  integrity: joi.boolean(),

  // css
  css: joi.object({
    extract: joi.alternatives().try(joi.boolean(), joi.object()),
    sourceMap: joi.boolean(),
    loaderOptions: joi.object({
      css: joi.object(),
      sass: joi.object(),
      scss: joi.object(),
      less: joi.object(),
      stylus: joi.object(),
      postcss: joi.object()
    })
  }),

  // webpack
  chainVite: joi.func(),
  configureVite: joi.alternatives().try(
    joi.object(),
    joi.func()
  ),

  // known runtime options for built-in plugins
  lintOnSave: joi.any().valid(true, false, 'error', 'warning', 'default'),
  pwa: joi.object(),

  // terser
  terser: joi.object({
    minify: joi.string().valid('terser', 'esbuild', 'swc', 'uglifyJs'),
    terserOptions: joi.object()
  }),

  // 3rd party plugin options
  pluginOptions: joi.object()
}))

exports.validate = (options, cb) => {
  validate(options, schema, cb)
}

// #2110
// https://github.com/nodejs/node/issues/19022
// in some cases cpus() returns undefined, and may simply throw in the future
function hasMultipleCores () {
  try {
    return require('os').cpus().length > 1
  } catch (e) {
    return false
  }
}

exports.defaults = () => ({
  // where to the index.html that the root directory of project
  root: process.cwd(),

  // The public infrastructure path for developing or producing environmental services

  base:'/',

  // where to output built files
  outDir: 'dist',

  // where to put static assets (js/css/img/font/...)
  assetsDir: '',

  // Alias for file system path
  alias:{},

  // Whether to generate a source map file after construction
  souremap: true,

  // Automatically open the application in the browser when the development server starts up. When the value is a string, it will be used as the path name for the URL
  open: '',

  // Specify which IP address the server should listen to
  host: 'localhost',

  // This option allows you to create custom public chunks. When the value is in object form, each attribute represents a chunk. When the value of this option is in the form of a function, each parsed module will be processed by this function. If the function returns a string, then the module and all its dependencies will be added to a custom chunk named after the return string
  codeSplit:{},
})
