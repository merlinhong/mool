// Infer rootOptions for individual generators being invoked
// in an existing project.
const { semver, isPlugin } = require('@vue/cli-shared-utils')
module.exports = function inferRootOptions (pkg) {
  const rootOptions = {}
  const deps = Object.assign({}, pkg.dependencies, pkg.devDependencies)

  // projectName
  rootOptions.projectName = pkg.name

  if ('vue' in deps) {
    const vue3Range = new semver.Range('^3.0.0-0', { includePrerelease: true })

    const depVueVersion = semver.minVersion(new semver.Range(deps.vue))

    if (semver.satisfies(depVueVersion, vue3Range)) {
      rootOptions.vueVersion = '3'
    }
  }

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
