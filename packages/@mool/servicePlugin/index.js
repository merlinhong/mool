const { Service } =require( "@mooljs/cli-service/lib/preset/service/src/index.ts");
const merge = require("lodash.merge");
module.exports = (api,options)=>{
    api.chainVite((config)=>{
        config.plugin.push(Service(merge({},options.service??{})))
    })
}