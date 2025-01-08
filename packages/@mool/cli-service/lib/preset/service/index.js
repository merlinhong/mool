import { Service } from "./src";
module.exports = (api,options)=>{
    api.chainVite((config)=>{
        config.plugin.push(Service(merge({},options.service??{})))
    })
}