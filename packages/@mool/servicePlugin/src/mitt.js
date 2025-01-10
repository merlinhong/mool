"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitt_1 = require("mitt");
// 创建事件总线
var emitter = (0, mitt_1.default)();
exports.default = emitter;
