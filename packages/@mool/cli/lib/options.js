const fs = require('fs')
const cloneDeep = require('lodash.clonedeep')
const { getRcPath } = require('./util/rcPath')
const { exit } = require('@vue/cli-shared-utils/lib/exit')
const { error } = require('@vue/cli-shared-utils/lib/logger')
const { createSchema, validate } = require('@vue/cli-shared-utils/lib/validate')

const rcPath = exports.rcPath = getRcPath('.vuerc')

const presetSchema = createSchema((joi) =>
  joi
    .object()
    .keys({
      useConfigFiles: joi.boolean(),
      router: joi
        .boolean()
        .warning('deprecate.error', {
          message: 'Please use @vue/cli-plugin-router instead.'
        })
        .message({
          'deprecate.error':
            'The {#label} option in preset is deprecated. {#message}'
        }),
      routerHistoryMode: joi
        .boolean()
        .warning('deprecate.error', {
          message: 'Please use @vue/cli-plugin-router instead.'
        })
        .message({
          'deprecate.error':
            'The {#label} option in preset is deprecated. {#message}'
        }),
      pinia: joi
        .boolean()
        .warning('deprecate.error', {
          message: 'Please use @vue/cli-plugin-vuex instead.'
        })
        .message({
          'deprecate.error':
            'The {#label} option in preset is deprecated. {#message}'
        }),
      cssPreprocessor: joi
        .string()
        .valid('sass', 'dart-sass', 'less', 'stylus'),
      plugins: joi.object().required(),
      configs: joi.object(),
      lintOn:joi.array(),
      answers:joi.object(),
      windicss: joi.boolean(), // windicss
    })
)

const schema = createSchema(joi => joi.object().keys({
  latestVersion: joi.string().regex(/^\d+\.\d+\.\d+(-(alpha|beta|rc)\.\d+)?$/),
  lastChecked: joi.date().timestamp(),
  packageManager: joi.string().valid('yarn', 'npm', 'pnpm'),
  useTaobaoRegistry: joi.boolean(),
  presets: joi.object().pattern(/^/, presetSchema)
}))

exports.validatePreset = preset => validate(preset, presetSchema, msg => {
  error(`invalid preset options: ${msg}`)
})

exports.defaultPreset = {
  useConfigFiles: false,
  cssPreprocessor: undefined,
  plugins: {
    '@mooljs/cli-plugin-eslint': {
      config: 'base',
      lintOn: ['save']
    }
  }
}

exports.defaults = {
  lastChecked: undefined,
  latestVersion: undefined,

  packageManager: undefined,
  useTaobaoRegistry: undefined,
  presets: {
    'Single': Object.assign(exports.defaultPreset),
    'Max': Object.assign(exports.defaultPreset),
    'Cross Platform': Object.assign(exports.defaultPreset),
  }
}

let cachedOptions

exports.loadOptions = () => {
  if (cachedOptions) {
    return cachedOptions
  }
  if (fs.existsSync(rcPath)) {
    try {
      cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'))
    } catch (e) {
      error(
        `Error loading saved preferences: ` +
        `~/.vuerc may be corrupted or have syntax errors. ` +
        `Please fix/delete it and re-run vue-cli in manual mode.\n` +
        `(${e.message})`
      )
      exit(1)
    }
    validate(cachedOptions, schema, () => {
      error(
        `~/.vuerc may be outdated. ` +
        `Please delete it and re-run vue-cli in manual mode.`
      )
    })
    return cachedOptions
  } else {
    return {}
  }
}

exports.saveOptions = toSave => {
  const options = Object.assign(cloneDeep(exports.loadOptions()), toSave)
  for (const key in options) {
    if (!(key in exports.defaults)) {
      delete options[key]
    }
  }
  cachedOptions = options
  try {
    fs.writeFileSync(rcPath, JSON.stringify(options, null, 2))
    return true
  } catch (e) {
    error(
      `Error saving preferences: ` +
      `make sure you have write access to ${rcPath}.\n` +
      `(${e.message})`
    )
  }
}

exports.savePreset = (name, preset) => {
  const presets = cloneDeep(exports.loadOptions().presets || {})
  presets[name] = preset
  return exports.saveOptions({ presets })
}
