const Layout = require("vite-plugin-vue-layouts").default;
const MaxPlugin = require("./plugins/max");
const { Service } = require("vite-plugin-service");
const RouterPlugin = require("@mooljs/cli-service/lib/vitePlugins/router");
const windicss = require("vite-plugin-windicss").default;
const {
  ElementPlusResolver,
} = require("unplugin-vue-components/resolvers");
const merge = require("lodash.merge");

const Components = require("unplugin-vue-components/vite").default;


function getMockConfig(mockOption) {
  // 如果mockOption是一个对象，则直接返回该对象扩展的配置
  if (typeof mockOption === 'object') {
      return {
          ignore: /index.ts/,
          watchFiles: true,
          ...mockOption,
      };
  }

  // 否则，根据mockOption的布尔值设置enable属性
  return {
      ignore: /index.ts/,
      watchFiles: true,
      enable: !!mockOption,
  };
}
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
      MaxPlugin(api,options),
      RouterPlugin(api,options),
      Layout(merge(layoutOptions(options.layout),options.layout??{})),
      Service({
        path: "src/service",
        mock: getMockConfig(options.mock),
      }),
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

