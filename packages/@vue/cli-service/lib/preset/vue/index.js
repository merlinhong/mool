import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import merge from 'lodash.merge';
module.exports = (api,options)=>{
    api.chainVite((config)=>{
        config.plugin.push(vue(merge({},options.vue??{})),vueJsx(merge({},options.vueJsx??{})))
    })
}