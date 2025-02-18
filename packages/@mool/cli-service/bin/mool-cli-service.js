#!/usr/bin/env node

const { semver, error,log } = require('@vue/cli-shared-utils')
const requiredVersion = require('../package.json').engines.node
const path = require("node:path");
const chokidar = require("chokidar");
const colors = require("picocolors");

if (!semver.satisfies(process.version, requiredVersion, { includePrerelease: true })) {
  error(
    `You are using Node ${process.version}, but mool-cli-service ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  )
  process.exit(1)
}

const Service = require('../lib/Service')
const service = new Service(process.env.VUE_CLI_CONTEXT || process.cwd())

const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv, {
  boolean: [
    // build
    // FIXME: --no-module, --no-unsafe-inline, no-clean, etc.
    'modern',
    'report',
    'report-json',
    'inline-vue',
    'watch',
    // serve
    'open',
    'copy',
    'https',
    // inspect
    'verbose'
  ]
})
const command = args._[0]
const watcher = chokidar.watch(path.resolve(process.cwd(),'.moolrc.ts'));
watcher.on('change',async (d)=>{
  log(`${colors.cyanBright('[vite]')} ${colors.greenBright('.moolrc.ts changed, restarting server...')}`);

  setTimeout(() => {
    service.run(command, args, rawArgv).catch(err => {
      error(err)
      process.exit(1)
    })
  }, 100);
})
service.run(command, args, rawArgv).catch(err => {
  error(err)
  process.exit(1)
})
