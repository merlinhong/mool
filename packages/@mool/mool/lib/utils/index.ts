const _toString = Object.prototype.toString;
export function isPlainObject<T extends Object>(value: any): value is T {
    return _toString.call(value) === '[object Object]';
}