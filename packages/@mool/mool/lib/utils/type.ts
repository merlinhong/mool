export const type = (o: any, strict: boolean = false): string => {

    var toString = Object.prototype.toString;
    if (o === null) {
        return 'null'
    }
    if (typeof o == 'number' || typeof o == 'string' || typeof o === 'boolean') {
        return typeof o
    }
    if (typeof o == 'number' && isNaN(o)) {
        return 'NaN';
    }

    var cls;
    var clsLow;
    try {
        cls = toString.call(o).slice(8, -1);
        clsLow = cls.toLowerCase();
    } catch (e) {
        // ie下的 activex对象
        return 'object';
    }
    if (clsLow !== 'object') {
        if (strict) {
            // 区分NaN和new Number
            if (clsLow === 'number' && isNaN(o)) {
                return 'NaN';
            }
            // 区分 String() 和 new String()
            if (clsLow === 'number' || clsLow === 'boolean' || clsLow === 'string') {
                return cls;
            }
        }
        return clsLow;
    }
    // eslint-disable-next-line eqeqeq
    if (o.constructor == Object) {
        return clsLow;
    }

    // Object.create(null)
    try {
        // __proto__ 部分早期firefox浏览器
        if (Object.getPrototypeOf(o) === null || o.__proto__ === null) {
            return 'object';
        }
    } catch (e) {
        // ie下无Object.getPrototypeOf会报错
    }

    // function A() {}; new A
    try {
        var cname = o.constructor.name;
        if (typeof cname === 'string') {
            return cname;
        }
    } catch (e) {
        // 无constructor
    }

    // function A() {}; A.prototype.constructor = null; new A
    return 'unknown';
}