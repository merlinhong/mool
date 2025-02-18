const AutoImport = require ("unplugin-auto-import/vite").default;
const Components = require ("unplugin-vue-components/vite").default;
const merge = require ('lodash.merge');
module.exports = (api,options)=>{
    const autoImportPluginOption = {
        imports: [
            "vue",
            "vue-router",
            {
              "@/service/index": ["service"],
            },
        ],
        dts: "auto-imports.d.ts",
    };
    const { components = {} } = options.autoImport || {};
    api.chainVite((config)=>{
       config.plugins.push(
        AutoImport(merge(autoImportPluginOption,options.autoImport??{})),
        Components(
            merge(
                {
                    resolvers: [],
                    dts: "components.d.ts",
                },
                components
            )
        ),
        )
    })
}