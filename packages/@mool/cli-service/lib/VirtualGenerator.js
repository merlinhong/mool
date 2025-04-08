const {sortPlugins} = require('./util/sortPlugins');
module.exports = class VirtualModuleGenerator {
    constructor(pluginModules) {
      this.modules = sortPlugins(pluginModules);
      console.log(this.modules);
    }
    generateImports(imports) {
      return this.modules.flatMap((_) => {
        return _.injectImports?.(imports) || [];
      }).join('\n');
    }
  
    generateRuntime(runtime) {
      return this.modules.map((_) => {
        return _.runtime?.(runtime) || '';
      }).join('\n');
    }
  
    generateVirtualModules() {
      return this.modules.reduce((acc, _) => {
        const vm = _.virtualModule?.();
        if (vm) acc[vm.id] = vm.content;
        return acc;
      }, {});
    }
    generateImportsMool(){
      return this.modules.flatMap((_) => {
        return _.injectMool?.() || [];
      }).join('\n');
    }
  }