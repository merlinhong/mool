import fs from "fs";

const toString = Object.prototype.toString;

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

// eslint-disable-next-line
export function isFunction<T = Function>(val: unknown): val is T {
  return is(val, "Function") || is(val, "AsyncFunction");
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, "RegExp");
}

export function isAbsPath(path: string | undefined) {
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
export function deepEqual(obj1: any, obj2: any) {
  // 如果两个对象是同一个引用，直接返回 true
  if (obj1 === obj2) return true;

  if (obj1 === undefined && obj2 === undefined) return true;

  if (obj2 === undefined && obj1 !== undefined) return false;
  if (obj1 === undefined && obj2 !== undefined) return false;

  // 获取对象的所有属性
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 如果属性数量不同，返回 false
  if (keys1.length !== keys2.length) return false;

  // 递归比较每个属性
  for (let key of keys1) {
    // 比较函数
    if (typeof obj1[key] === "function" && typeof obj2[key] === "function") {
      if (obj1[key].toString() !== obj2[key].toString()) {
        return false;
      }
    } else if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, time);
  });
}
