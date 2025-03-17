const  mitt = require("mitt");
// 创建事件总线
const emitter = mitt();

module.exports =  emitter;