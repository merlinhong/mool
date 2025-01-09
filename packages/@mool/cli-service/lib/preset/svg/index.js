const svgLoader = require('vite-svg-loader');
module.exports = (api,options)=>{
    api.chainVite((config)=>{
        options.svgc&&config.plugin(svgLoader({svgoConfig:{},svgo:!!options.svgo}))
    })
}