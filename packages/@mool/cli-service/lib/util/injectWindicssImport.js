const path = require("path");
const fs = require("fs");
const writeFile = (filePath, updatedContent) => {
  // 写回文件
  fs.writeFile(filePath, updatedContent, "utf8", (err) => {
    if (err) {
      return console.error("写入文件时出错:", err);
    }
  });
};
let useWindicss = false;
exports.injectWindicssImport = function (file, imports, options) {
  // 文件路径
  const filePath = path.resolve(__dirname, file);

  // 要追加的 import 语句
  const importStatement = imports;

  let updatedContent = "";
  if (options.windicss && useWindicss) return;
  if (!options.windicss && !useWindicss) return;
  // 读取文件内容
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.error("读取文件时出错:", err);
    }
    if (data.includes(importStatement)) {
      if (!options.windicss) {
        updatedContent = data.replace(importStatement + "\n", "");
        writeFile(filePath, updatedContent);
        useWindicss = false;
      }
      return;
    }
    if (options.windicss) {
      // 追加 import 语句到文件内容
      updatedContent = `${importStatement}\n${data}`;
      writeFile(filePath, updatedContent);
      useWindicss = true;
    }
  });
};
