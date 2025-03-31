const Layout = require("vite-plugin-vue-layouts").default;
const TranformPlugin = require("@mooljs/cli-service/lib/vitePlugins/tranform");
const RouterPlugin = require("@mooljs/cli-service/lib/vitePlugins/router");
const windicss = require("vite-plugin-windicss").default;
const {
  ElementPlusResolver,
} = require("unplugin-vue-components/resolvers");
const merge = require("lodash.merge");

const Components = require("unplugin-vue-components/vite").default;

module.exports = (api, options) => {
  const layoutOptions = (layout)=>{
    if(layout){
      return {
        layoutsDirs:api.resolve('node_modules/@mooljs/plugin-layout/layouts')
      }
    }else{
      return {}
    }
  }
  api.chainVite((config) => {
    config.plugins.push(
      TranformPlugin(api,options),
      RouterPlugin(api,options),
      Layout(merge(layoutOptions(options.layout),options.layout??{})),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: "types/components.d.ts",
      })
    );
    if (options.windicss) {
      config.plugins.push(windicss());
    }
  });
};

