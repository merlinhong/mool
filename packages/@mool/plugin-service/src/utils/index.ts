const _toString = Object.prototype.toString;

export function isPlainObject<T extends Object>(value: any): value is T {
    return _toString.call(value) === "[object Object]";
  }
export function serialize(obj: any, prefix?: string): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // 如果是嵌套对象，递归调用
      parts.push(serialize(value, fullKey));
    } else {
      // 如果是基本类型或数组，直接添加到parts数组中
      parts.push(encodeURIComponent(fullKey) + '=' + encodeURIComponent(String(value)));
    }
  }
  return parts.join('&');
}
