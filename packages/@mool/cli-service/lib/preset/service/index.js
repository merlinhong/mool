const { Service } =require( "vite-plugin-service");
const merge = require("lodash.merge");

module.exports = (api,options)=>{
    api.chainVite((config)=>{
        config.plugins.push(Service(merge({},options.service??{})))
    })
}