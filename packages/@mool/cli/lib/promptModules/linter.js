module.exports = cli => {
  const { chalk, hasGit,semver } = require('@vue/cli-shared-utils')

  cli.injectFeature({
    name: 'Linter / Formatter',
    value: 'linter',
    short: 'Linter',
    description: 'Check and enforce code quality with ESLint or Prettier',
    link: 'https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint',
    plugins: ['eslint'],
    checked: true
  })

  cli.injectPrompt({
    name: 'eslintConfig',
    when: answers => answers.features.includes('linter'),
    type: 'list',
    message: 'Pick a linter / formatter config:',
    description: 'Checking code errors and enforcing an homogeoneous code style is recommended.',
    choices: answers => [
      {
        name: '@antfu/eslint-config' + (chalk.blue('(Preset commonly used ESLint configurations and rules)')+chalk.red('(requires node>18.18.0)')),
        value: 'antfu',
        short: 'Antfu'
      },
      {
        name: 'ESLint + Typescript + Prettier',
        value: 'eslint',
        short: 'ESLint'
      }
    ]
  })

  cli.injectPrompt({
    name: 'lintOn',
    message: 'Pick additional lint features:',
    when: answers => answers.features.includes('linter'),
    type: 'checkbox',
    choices: [
      {
        name: 'Lint on save',
        value: 'save',
        checked: true
      },
      {
        name: 'Lint and fix on commit' + (hasGit() ? '' : chalk.red(' (requires Git)')),
        value: 'commit'
      }
    ]
  })

  cli.onPromptComplete((answers, options) => {
    if (answers.features.includes('linter')) {
      options.plugins['@mooljs/plugin-eslint'] = {
        config: answers.eslintConfig,
        lintOn: answers.lintOn
      }
    }
  })
}
