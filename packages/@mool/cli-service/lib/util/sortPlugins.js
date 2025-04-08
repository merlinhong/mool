exports.topologicalSort = function (plugins) {
  // 初始化数据结构
  const graph = new Map();  // 依赖图：key → 被依赖项，value → 依赖项集合
  const inDegree = new Map(); // 入度计数器
  const order = []; // 结果队列

  // 初始化所有节点
  plugins.forEach(p => {
    graph.set(p.name, new Set());
    inDegree.set(p.name, 0);
  });

  // 构建依赖图
  plugins.forEach(p => {
    p.after.forEach(dep => {
      graph.get(dep).add(p.name); // 被依赖项 → 当前插件
      inDegree.set(p.name, inDegree.get(p.name) + 1); // 当前插件入度+1
    });
  });

  // Kahn 算法核心
  const queue = [];
  inDegree.forEach((val, key) => {
    if (val === 0) queue.push(key);
  });

  while (queue.length) {
    const current = queue.shift();
    order.push(current);

    graph.get(current).forEach(dependent => {
      inDegree.set(dependent, inDegree.get(dependent) - 1);
      if (inDegree.get(dependent) === 0) {
        queue.push(dependent);
      }
    });
  }

  // 检测循环依赖
  if (order.length !== plugins.length) {
    throw new Error('存在循环依赖或无效依赖项');
  }

  return order.map(_=>plugins.find(p=>p.name===_));
}
/**
* Arrange plugins by 'after' property.
* @param {Array<Plugin>} plugins
* @returns {Array<Plugin>}
*/
exports.sortPlugins = function (plugins) {
if (plugins.length < 2) return plugins

return exports.topologicalSort(plugins)
}