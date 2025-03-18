exports.getPromptModules = () => {
  return [
    'linter',
  ].map(file => require(`../promptModules/${file}`))
}
