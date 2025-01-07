exports.getPromptModules = () => {
  return [
    'pinia',
    'cssPreprocessors',
    'linter',
    'unit',
  ].map(file => require(`../promptModules/${file}`))
}
