"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is = is;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.isRegExp = isRegExp;
exports.isAbsPath = isAbsPath;
exports.deepEqual = deepEqual;
exports.sleep = sleep;
var toString = Object.prototype.toString;
function is(val, type) {
    return toString.call(val) === "[object ".concat(type, "]");
}
// eslint-disable-next-line
function isFunction(val) {
    return is(val, "Function") || is(val, "AsyncFunction");
}
function isArray(val) {
    return val && Array.isArray(val);
}
function isRegExp(val) {
    return is(val, "RegExp");
}
function isAbsPath(path) {
    if (!path) {
        return false;
    }
    // Windows 路径格式：C:\ 或 \\ 开头，或已含盘符（D:\path\to\file）
    if (/^([a-zA-Z]:\\|\\\\|(?:\/|\uFF0F){2,})/.test(path)) {
        return true;
    }
    // Unix/Linux 路径格式：/ 开头
    return /^\/[^/]/.test(path);
}
function deepEqual(obj1, obj2) {
    // 如果两个对象是同一个引用，直接返回 true
    if (obj1 === obj2)
        return true;
    if (obj1 === undefined && obj2 === undefined)
        return true;
    if (obj2 === undefined && obj1 !== undefined)
        return false;
    if (obj1 === undefined && obj2 !== undefined)
        return false;
    // 获取对象的所有属性
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);
    // 如果属性数量不同，返回 false
    if (keys1.length !== keys2.length)
        return false;
    // 递归比较每个属性
    for (var _i = 0, keys1_1 = keys1; _i < keys1_1.length; _i++) {
        var key = keys1_1[_i];
        // 比较函数
        if (typeof obj1[key] === "function" && typeof obj2[key] === "function") {
            if (obj1[key].toString() !== obj2[key].toString()) {
                return false;
            }
        }
        else if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
}
function sleep(time) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve("");
        }, time);
    });
}
