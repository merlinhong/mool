const { Service } = require("vite-plugin-service");
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
    api.chainVite((config) => {
        config.plugins.push(Service({
            path: "./src/service",
            mock: getMockConfig(options.mock),
        }))
    })
}