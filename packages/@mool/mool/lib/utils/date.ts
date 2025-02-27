/**
 * 将字符串多余的长度补齐0
 * @param {string} s 需补齐的字符串
 * @param {number} len 补齐长度
 * @return {string} 补齐后的字符串
 */
const paddingFillWith0 = (s: string, len: number): string => {
  len -= `${s}`.length;

  for (let i = 0; i < len; i++) {
    s = `0${s}`;
  }

  return s;
};

/**
 * 日期匹配的正则表达式
 * Y:年
 * M:月
 * D:日
 * h:小时
 * m:分钟
 * s:秒
 * i:毫秒
 * w:星期(小写的)
 * W:星期(大写的)
 */
const SIGN_DATE_REG: RegExp = /([YyMDdHhmsiWw])(\1*)/g;

/**
 * 默认的pattern
 * 'YYYY-MM-DD hh:mm:ss:iii'
 */
const DEFAULT_PATTERN: string = "YYYY-MM-DD hh:mm:ss:iii";

export class MyDate extends Date {
  /**
   * 定义静态方法，解析成拓展的日期对象
   * @param {string} dateString 日期字符串
   * @param {string} pattern 匹配字符串,可以手动传入,或者采取默认
   * @return {MyDate} 返回一个MyDate对象
   */
  parseDate(dateString: string, pattern?: string): MyDate {
    if (!dateString || typeof dateString === "number") {
      // 普通的构造，时间戳、纯数字以及其它多参数构造情况（多参数情况，第一个参数也是数字）
      return new (Function.prototype.bind.apply(
        MyDate,
        [MyDate].concat(Array.prototype.slice.call(arguments)),
      ))();
    }

    try {
      dateString = dateString || "";
      // 判断需要的匹配模式
      pattern = pattern || DEFAULT_PATTERN;

      // 格式的正则匹配式，譬如YYYY-MM-DD hh:mm:ss:iii
      const matchs1 = pattern.match(SIGN_DATE_REG);
      // 值的正则匹配式，将实际的时间数据提取出来，和前面一一对应
      const matchs2 = dateString.match(/(\d)+/g);

      if (matchs1 && matchs1.length > 0) {
        const myDate = new MyDate(1970, 0, 1);

        for (let i = 0, len = matchs1.length; i < len; i++) {
          const mTarget = parseInt(matchs2[i], 10) || 0;

          switch (matchs1[i].charAt(0) || "") {
            case "Y":
              myDate.setFullYear(mTarget);
              break;
            case "M":
              myDate.setMonth(mTarget - 1);
              break;
            case "D":
              myDate.setDate(mTarget);
              break;
            case "h":
              myDate.setHours(mTarget);
              break;
            case "m":
              myDate.setMinutes(mTarget);
              break;
            case "s":
              myDate.setSeconds(mTarget);
              break;
            case "i":
              myDate.setMilliseconds(mTarget);
              break;
            default:
              break;
          }
        }

        return myDate;
      }
    } catch (e) {
      throw new Error("解析成MyDate失败，请检查传入格式！");
    }
  }

  /**
   * 写自己的原型方法，这里实现一个按任何格式的输出方法
   * @param {string} fmt 自己需要输出的格式，经典的yyyyMMddhhmmssiiww系列
   * @return {string} 返回一个字符串
   */
  format(fmt?: string): string {
    const pattern = fmt || DEFAULT_PATTERN;
    const value = this;

    return pattern.replace(SIGN_DATE_REG, ($0) => {
      switch ($0.charAt(0)) {
        case "Y":
        case "y":
          return paddingFillWith0(value.getFullYear().toString(), $0.length);
        case "M":
          return paddingFillWith0((value.getMonth() + 1).toString(), $0.length);
        case "D":
        case "d":
          return paddingFillWith0(value.getDate().toString(), $0.length);
        case "H":
        case "h":
          return paddingFillWith0(value.getHours().toString(), $0.length);
        case "m":
          return paddingFillWith0(value.getMinutes().toString(), $0.length);
        case "s":
          return paddingFillWith0(value.getSeconds().toString(), $0.length);
        case "i":
          return paddingFillWith0(
            value.getMilliseconds().toString(),
            $0.length,
          );
        case "w":
          return value.getDay().toString();
        case "W":
          const week = ["日", "一", "二", "三", "四", "五", "六"];
          return paddingFillWith0(week[value.getDay()], $0.length);
        default:
          return "";
      }
    });
  }

  /**
   * 获取绝对毫秒数，这里补上了getTime造成的时区差
   * @param {boolean} isTimezoneOffsetFixed 是否补齐时区误差
   * @return {number} 返回绝对时间戳
   */
  getAbsoluteMillonsTime(isTimezoneOffsetFixed: boolean): number {
    const offset = isTimezoneOffsetFixed
      ? this.getTimezoneOffset() * 60 * 1000
      : 0;

    return this.getTime() + offset;
  }

  /**
   * 返回字符串时间戳
   * @param {boolean} isTimezoneOffsetFixed 是否补齐时区误差
   * @return {string} 返回绝对时间戳，19700101到现在的
   */
  toTimeStap(isTimezoneOffsetFixed: boolean): string {
    return `${this.getAbsoluteMillonsTime(isTimezoneOffsetFixed)}`;
  }

  /**
   * 返回往后n秒的时间
   * @param {number} num 往后几秒小时，默认为0
   * @return {MyDate} 返回一个计算后的MyDate对象
   */
  nextSeconds(num: number = 1): MyDate {
    return new MyDate(this.getTime() + num * 1000);
  }

  nextMinutes(num: number = 1): MyDate {
    return this.nextSeconds(60 * num);
  }

  nextHours(num: number = 1): MyDate {
    return this.nextMinutes(60 * num);
  }

  nextDays(num: number = 1): MyDate {
    return this.nextHours(24 * num);
  }

  /**
   * 返回往后n月的时间，这里会自动计算每月的天数，1月后面就是2月，紧接着3月
   * @param {number} num 往后几秒小时，默认为0
   * @return {MyDate} 返回一个计算后的MyDate对象
   */
  nextMonths(num: number = 0): MyDate {
    const originMonth = this.getMonth() + 1;
    const originYear = this.getFullYear();
    const daysPerMonth = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let days = 0;

    for (let i = 0; i < num; i++) {
      let currMonth = originMonth + i;
      const currYear = originYear + Math.floor(currMonth / 12);
      const isLeapYear =
        currYear % 4 === 0 && (currYear % 100 !== 0 || currYear % 400 !== 0);

      daysPerMonth[1] = isLeapYear ? 29 : 28;
      currMonth %= 12;
      if (currMonth === 0) {
        currMonth = 11;
      } else {
        currMonth -= 1;
      }
      days += daysPerMonth[currMonth];
    }

    return this.nextDays(days);
  }

  nextYears(num: number = 0): MyDate {
    return this.nextMonths(12 * num);
  }

  /**
   * 和另一个时间比较，必须也是MyDate类型
   * @param {MyDate} another 另一个日期对象，也可以是一个普通的日期对象
   * @param {string} pattern 模式字符串，需要比较到何等程度
   * @return {number} 返回一个便宜数字，大于0代表当前时间大于比较时间，小于0就是小于，否则等于
   */
  compare(another: MyDate, pattern: string = "s"): number {
    if (!(another instanceof MyDate)) {
      throw new Error("比较类型错误，必须是MyDate型");
    }

    let formatPattern = "";

    switch (pattern.charAt(0)) {
      case "Y":
      case "y":
        formatPattern = "YYYY";
        break;
      case "M":
        formatPattern = "YYYYMM";
        break;
      case "D":
      case "d":
        formatPattern = "YYYYMMDD";
        break;
      case "H":
      case "h":
        formatPattern = "YYYYMMDDhh";
        break;
      case "m":
        formatPattern = "YYYYMMDDhhmm";
        break;
      case "S":
      case "s":
        formatPattern = "YYYYMMDDhhmmss";
        break;
      case "I":
      case "i":
        formatPattern = "YYYYMMDDhhmmssiii";
        break;
      default:
        break;
    }

    const now = +this.format(formatPattern);
    const anotherTime = +another.format(formatPattern);

    return now - anotherTime;
  }
}

