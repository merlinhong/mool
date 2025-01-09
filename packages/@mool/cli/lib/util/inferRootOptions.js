// Infer rootOptions for individual generators being invoked
// in an existing project.
const { semver, isPlugin } = require('@vue/cli-shared-utils')
module.exports = function inferRootOptions (pkg) {
  const rootOptions = {}
  const deps = Object.assign({}, pkg.dependencies, pkg.devDependencies)

  // projectName
  rootOptions.projectName = pkg.name
  

  // router
  if ('vue-router' in deps) {
    rootOptions.router = true
  }

  // vuex
  if ('pinia' in deps) {
    rootOptions.pinia = true
  }

  // cssPreprocessors
  if ('sass' in deps) {
    rootOptions.cssPreprocessor = 'sass'
  } else if ('less' in deps) {
    rootOptions.cssPreprocessor = 'less'
  }
  rootOptions.plugins = Object.keys(deps)
    .filter(isPlugin)
    .reduce((plugins, name) => {
      plugins[name] = {}
      return plugins
    }, {})

  return rootOptions
}
