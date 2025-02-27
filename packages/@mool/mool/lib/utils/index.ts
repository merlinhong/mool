const _toString = Object.prototype.toString;
const IV = new Uint8Array([2, 2, 4, 8, 5, 7, 7, 8, 0, 9, 1, 4, 3, 8, 5, 6]); //初始向量

export function isPlainObject<T extends Object>(value: any): value is T {
  return _toString.call(value) === "[object Object]";
}

// 获取地址栏参数
export function getUrlParam(
  name: string,
  isHash: boolean = false,
  target: Window | null = window,
): string | null {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  if (isHash) {
    const hash = target?.location.hash;
    // // 创建 URL 对象，注意去掉 # 符号
    const urlObj = new URL((hash ?? "").slice(1), window.location.origin);
    // // 使用 URLSearchParams 获取查询参数
    const params = new URLSearchParams(urlObj.search);
    return params.get(name);
  } else {
    const r = target?.location.search.substring(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
  }
}
/**
 * 生成随机id
 * @param options
 * @returns {string}
 */
export const uuid = (options: {
  radix?: number;
  len?: number;
  type?: "default";
}) => {
  options = options || {};

  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  const uuidArr: string[] = [];
  let i;
  let radix = options.radix || chars.length;
  let len = options.len || 5;
  const type = options.type || "default";

  len = Math.min(len, 36);
  len = Math.max(len, 4);
  radix = Math.min(radix, 62);
  radix = Math.max(radix, 2);

  if (len) {
    for (i = 0; i < len; i++) {
      uuidArr[i] = chars[0 | (Math.random() * radix)];
    }

    if (type === "default") {
      len > 23 && (uuidArr[23] = "-");
      len > 18 && (uuidArr[18] = "-");
      len > 13 && (uuidArr[13] = "-");
      len > 8 && (uuidArr[8] = "-");
    }
  }

  return uuidArr.join("");
};
// 延迟
export function sleep(duration: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, duration);
  });
}

/**
 * 浏览器AES-GCM编码
 * @param data
 * @param base64Key
 * @param iv
 * @returns
 */

export async function encrypt(
  data: string,
  base64Key: string,
  iv: Uint8Array = IV,
) {
  // 将 Base64 编码的密钥解码为 Uint8Array
  const key = await window.crypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0)),
    "AES-GCM",
    true,
    ["encrypt"],
  );

  // 生成随机 IV
  // const iv = window.crypto.getRandomValues(new Uint8Array(12));
  // 将数据编码为 Uint8Array
  const encodedData = new TextEncoder().encode(data);

  // 使用 AES-GCM 加密数据
  const encryptedBytes = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: 128,
    },
    key,
    encodedData,
  );

  // 将 IV 和加密数据一起编码为 Base64 字符串
  const encryptedDataWithIv = new Uint8Array(12 + encryptedBytes.byteLength);
  encryptedDataWithIv.set(iv);
  encryptedDataWithIv.set(new Uint8Array(encryptedBytes), 12);

  return btoa(String.fromCharCode(...encryptedDataWithIv));
}
// 浏览器信息
export function getBrowser() {
    const { clientHeight, clientWidth } = document.documentElement;
  
    // 浏览器信息
    const ua = navigator.userAgent.toLowerCase();
  
    // 浏览器类型
    let type = (ua.match(/firefox|chrome|safari|opera/g) || "other")[0];
  
    if ((ua.match(/msie|trident/g) || [])[0]) {
      type = "msie";
    }
  
    // 平台标签
    let tag = "";
  
    const isTocuh = "ontouchstart" in window || ua.indexOf("touch") !== -1 || ua.indexOf("mobile") !== -1;
    if (isTocuh) {
      if (ua.indexOf("ipad") !== -1) {
        tag = "pad";
      } else if (ua.indexOf("mobile") !== -1) {
        tag = "mobile";
      } else if (ua.indexOf("android") !== -1) {
        tag = "androidPad";
      } else {
        tag = "pc";
      }
    } else {
      tag = "pc";
    }
  
    // 浏览器内核
    let prefix = "";
  
    switch (type) {
      case "chrome":
      case "safari":
      case "mobile":
        prefix = "webkit";
        break;
      case "msie":
        prefix = "ms";
        break;
      case "firefox":
        prefix = "Moz";
        break;
      case "opera":
        prefix = "O";
        break;
      default:
        prefix = "webkit";
        break;
    }
  
    // 操作平台
    const plat = ua.indexOf("android") > 0 ? "android" : navigator.platform.toLowerCase();
  
    // 屏幕信息
    let screen = "full";
  
    if (clientWidth < 768) {
      screen = "xs";
    } else if (clientWidth < 992) {
      screen = "sm";
    } else if (clientWidth < 1200) {
      screen = "md";
    } else if (clientWidth < 1920) {
      screen = "xl";
    } else {
      screen = "full";
    }
  
    // 是否 ios
    const isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  
    // 是否 PC 端
    const isPC = tag === "pc";
  
    // 是否移动端
    const isMobile = isPC ? false : true;
  
    // 是否移动端 + 屏幕宽过小
    const isMini = screen === "xs" || isMobile;
  
    return {
      height: clientHeight,
      width: clientWidth,
      type,
      plat,
      tag,
      prefix,
      isMobile,
      isIOS,
      isPC,
      isMini,
      screen,
    };
  }

export * from './cloneDeep';
export * from './date';
export * from './storage';
export * from './type';
export * from './loading';
export * from './deepMerge';