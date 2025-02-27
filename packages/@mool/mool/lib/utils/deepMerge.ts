import { isPlainObject } from ".";
export function deepMerge<T extends Object>(...objs: (T | undefined)[]): T {
    const result: { [key: string]: any } = {};
  
    for (const obj of objs.filter(isPlainObject) as T[]) {
      for (const [key, val] of Object.entries(obj)) {
        if (isPlainObject(val)) {
          const rVal = result[key];
          result[key] = isPlainObject(rVal) ? deepMerge(rVal, val) : deepMerge(val);
        } else {
          result[key] = val;
        }
      }
    }
  
    return result as T;
  }