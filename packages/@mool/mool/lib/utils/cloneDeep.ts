/*
 * 作者: merlinhong
 * 版本: [1.0]
 * 描述: 深拷贝
 */

/**
 *  深度优化遍历的深拷贝
 * @param {<T>} x
 */
export function cloneDeep(x: { [k in string]: any }, cache: boolean = false) {
  const root = {} as typeof x;

  // 初始条件，循环的初始条件为一个节点栈，栈中存放当前需要执行操作的对象，这里是深克隆
  const looplist = [
    {
      parent: root,
      key: '',
      data: x,
    },
  ];

  // 判断条件，判断条件为栈是否为空，也就是判断所有深层次对象是否全部克隆完毕

  while (looplist.length) {
    // 循环体，取出当前待克隆的节点属性，包括节点的id、节点的val、以及父节点(这里都是指向最终克隆完成的root对象)

    const node = looplist.pop();
    const parent = node?.parent; // 对象引用指向 root {}
    const key = node?.key;
    const data = node?.data;

    // 此处是深克隆的核心循环体代码，
    let res = {} as typeof x; // 创建一个临时变量，用来传递引用关系
    if (typeof key !== "undefined") {
      res = parent[key] = {}; // 继续给当前节点创建拷贝对象，通过引用传递指向root同一内存空间
    }

    // 循环条件， 这里通过判断子节点是否为对象作为循环体执行下去继续深克隆的循环条件
    for (let k in data) {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        if (typeof data[k] === "object" && data[k] !== null) {
          // 下一次循环
          looplist.push({
            parent: res,
            key: k,
            data: data[k],
          });
        } else {
          res[k] = data[k];
        }
      }
    }
  }
  return root;
}
