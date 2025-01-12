const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const isFileEsm = require('is-file-esm')
const { loadModule } = require('@vue/cli-shared-utils')

module.exports = function loadFileConfig (context) {
  let fileConfig, fileConfigPath

  const possibleConfigPaths = [
    './moolrc',
    './mool.config.js',
    './mool.config.mjs',
    './mool.config.cjs',
    './mool.config.ts'
  ]
  for (const p of possibleConfigPaths) {
    const resolvedPath = p && path.resolve(context, p)
    if (resolvedPath && fs.existsSync(resolvedPath)) {
      fileConfigPath = resolvedPath
      break
    }
  }

  if (fileConfigPath) {
    const { esm } = isFileEsm.sync(fileConfigPath)

    if (esm) {
      fileConfig = import(pathToFileURL(fileConfigPath))
    } else {
      fileConfig = loadModule(fileConfigPath, context)
    }
  }

  return {
    fileConfig,
    fileConfigPath
  }
}
