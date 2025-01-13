const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const isFileEsm = require('is-file-esm')
const { loadModule } = require('@vue/cli-shared-utils')
const { execSync } = require('child_process')
const { bundleRequire, GetOutputFile, JS_EXT_RE } = require("bundle-require") ;

module.exports = async function loadFileConfig (context) {
  let fileConfig, fileConfigPath

  const possibleConfigPaths = [
    process.env.VUE_CLI_SERVICE_CONFIG_PATH,
    './.moolrc.ts',
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
    if(!fileConfigPath.includes('.moolrc.ts')){
      const { esm } = isFileEsm.sync(fileConfigPath)

      if (esm) {
        fileConfig = import(pathToFileURL(fileConfigPath))
      } else {
        fileConfig = loadModule(fileConfigPath, context)
      }
    }else{
      const dd = await bundleRequire({
        filepath:fileConfigPath,
      });
      console.log(dd);

      // fileConfig = import(pathToFileURL(fileConfigPath))
    }
  }

  return {
    fileConfig,
    fileConfigPath
  }
}
