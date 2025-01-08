module.exports = cli => {
  cli.injectFeature({
    name: 'Pinia',
    value: 'pinia',
    description: 'Manage the app state with a centralized store',
    link: 'https://pinia.vuejs.org/'
  })

  cli.onPromptComplete((answers, options) => {
    if (answers.features.includes('pinia')) {
      options.plugins['@mool/plugin-pinia'] = {}
    }
  })
}

