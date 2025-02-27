const path = require("path");
const fs = require("fs");
exports.injectImport = function (file, imports) {
  // 文件路径
  const filePath = path.resolve(__dirname, file);

  // 要追加的 import 语句
  const importStatement = imports;

  // 读取文件内容
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.error("读取文件时出错:", err);
    }
    if(data.includes(importStatement)){
      return
    }
    // 追加 import 语句到文件内容
    const updatedContent = `${importStatement}\n${data}`;

    // 写回文件
    fs.writeFile(filePath, updatedContent, "utf8", (err) => {
      if (err) {
        return console.error("写入文件时出错:", err);
      }
    });
  });
};
