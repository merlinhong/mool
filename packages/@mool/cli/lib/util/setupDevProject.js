// dev only

const path = require('path')
const { linkBin } = require('./linkBin')

module.exports = function setupDevProject (targetDir) {
  return linkBin(
    require.resolve('@mooljs/cli-service/bin/mool-cli-service'),
    path.join(targetDir, 'node_modules', '.bin', 'mool-cli-service')
  )
}
