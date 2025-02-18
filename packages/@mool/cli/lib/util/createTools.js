exports.getPromptModules = () => {
  return [
    'pinia',
    'cssPreprocessors',
    'linter',
    'unit',
    'windicss'
  ].map(file => require(`../promptModules/${file}`))
}
