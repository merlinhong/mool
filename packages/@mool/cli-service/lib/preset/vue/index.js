const { merge } = require("lodash.merge");
const vueJsx = require("@vitejs/plugin-vue-jsx");
const vue = require("@vitejs/plugin-vue");
module.exports = (api,options)=>{
    api.chainVite((config)=>{
        config.plugin.push(vue(merge({},options.vue??{})),vueJsx(merge({},options.vueJsx??{})))
    })
}