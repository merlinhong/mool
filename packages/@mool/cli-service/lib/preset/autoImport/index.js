import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import merge from 'lodash.merge';
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
       config.plugin.push(
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