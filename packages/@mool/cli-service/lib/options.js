const { createSchema, validate } = require('@vue/cli-shared-utils')

const schema = createSchema(joi => joi.object({
  base: joi.string().allow(''),
  outDir: joi.string(),
  root: joi.string(),
  open:joi.alternatives().try(
    joi.any().valid(true,false),
    joi.string().allow('')
  ),
  route:joi.alternatives().try(
    joi.object(),
    joi.array()
  ),
  layout:joi.alternatives().try(
    joi.object(),
  ),
  proxy:joi.alternatives().try(
    joi.object(),
  ),
  port:joi.number().allow(),
  assetsDir:joi.string(),
  alias:joi.alternatives().try(
    joi.object(),
  ),
  windicss:joi.alternatives().try(
    joi.object(),
  ),
  souremap:joi.any().valid(true, false),
  // webpack
  chainVite: joi.func(),
  configureVite: joi.alternatives().try(
    joi.object(),
    joi.func()
  ),
  codeSplitting:joi.alternatives().try(
    joi.object(),
    joi.func()
  ),
  svgc:joi.alternatives().try(
    joi.object(),
  ),
  svgo:joi.alternatives().try(
    joi.object(),
  ),
  service:joi.alternatives().try(
    joi.object(),
  ),
  eslint:joi.alternatives().try(
    joi.object(),
  ),
  compression:joi.alternatives().try(
    joi.object(),
  ),
  mock:joi.any().valid(true, false),
  // known runtime options for built-in plugins
  lintOnSave: joi.any().valid(true, false, 'error', 'warning', 'default'),
  autoImport:joi.alternatives().try(
    joi.array(),
  )
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
