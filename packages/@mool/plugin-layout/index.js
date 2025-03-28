const pages = require("vite-plugin-pages").default;
const merge = require("lodash.merge");
const {transformRoutes} = require('./utils/transformRoutes');
const pagesPluginOption = {
  dirs: "src/pages", // 需要生成路由的文件目录，默认就是识别src下面的pages文件
  exclude: ["**/components/*.vue"], // 排除在外的目录，上面配置目录的例子，里面有 components 目录，我们不希望他被解析为路由
};

module.exports = async (api, options) => {
  if (options.routes && Array.isArray(options.routes)) {
    const routes = transformRoutes(options.routes,{},options.access);
    pagesPluginOption.onRoutesGenerated = () => {
      return routes?.map(_ => {
        if (_.routes) {
          return [_, ..._.routes]
        } else {
          return _
        }
      }).flat()
    }
  }
  api.chainVite((config) => {
    config.plugins.push(
      pages(merge(pagesPluginOption, options.route ?? {})),
    );
  });

};
