module.exports = cli => {
    cli.injectFeature({
      name: 'Windicss',
      value: 'windicss',
      description: 'Css frame for next',
      link: 'https://cn.windicss.org/'
    })
  
    cli.onPromptComplete((answers, options) => {
      if (answers.features.includes('windicss')) {
        options.plugins['@mooljs/plugin-windicss'] = {}
      }
    })
  }
  
  