import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  entries: ['src/createService'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})