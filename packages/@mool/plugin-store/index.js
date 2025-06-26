const { readFileSync, existsSync, readdirSync,statSync } = require("node:fs");
const {join,basename,extname,sep}  = require('node:path');

/**
 * 查找指定目录下所有store文件夹中的ts文件
 * @param {string} dir 要搜索的目录
 * @returns {string[]} 匹配文件的完整路径数组
 */
function findTsFilesInStoreDirectories(dir) {
  let results = [];
  
  try {
    // 读取目录内容
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      
      try {
        const stat = statSync(fullPath);
        
        // 如果是目录
        if (stat.isDirectory()) {
          // 如果目录名称为store，则搜索其中的所有ts文件
          if (basename(fullPath) === 'store') {
            results = results.concat(findAllTsFilesInDirectory(fullPath));
          } 
          // 继续递归搜索其他目录
          results = results.concat(findTsFilesInStoreDirectories(fullPath));
        }
      } catch (statError) {
        console.error(`无法访问 ${fullPath}:`, statError.message);
      }
    }
  } catch (readError) {
    console.error(`无法读取目录 ${dir}:`, readError.message);
  }
  
  return results;
}

/**
 * 递归查找指定目录及其子目录下的所有ts文件
 * @param {string} dir 要搜索的目录
 * @returns {string[]} 匹配文件的完整路径数组
 */
function findAllTsFilesInDirectory(dir) {
  let results = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      
      try {
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // 递归搜索子目录
          results = results.concat(findAllTsFilesInDirectory(fullPath));
        } else if (extname(fullPath) === '.ts') {
          // 添加ts文件到结果
          results.push(fullPath);
        }
      } catch (statError) {
        console.error(`无法访问 ${fullPath}:`, statError.message);
      }
    }
  } catch (readError) {
    console.error(`无法读取目录 ${dir}:`, readError.message);
  }
  
  return results;
}
/**
 * 从完整路径中提取从src开始的相对路径
 * @param {string} filePath 完整文件路径
 * @returns {string} 从src开始的相对路径
 */
function extractPathFromSrc(filePath) {
  const srcIndex = filePath.indexOf(sep + 'src' + sep);
  if (srcIndex !== -1) {
    return filePath.substring(srcIndex + 1); // +1 是为了去掉开头的路径分隔符
  }
  return filePath; // 如果没找到src，返回原路径
}
/**
 * 提取项目文件夹到文件名的路径，去掉store部分，不包含扩展名
 * @param {string} relativePath 从src开始的相对路径
 * @param {string} projectFolder 项目文件夹名称 (如 "pages")
 * @returns {string} 处理后的路径
 */
function extractPathWithoutStore(relativePath, projectFolder) {
  // 分割路径为各部分
  const parts = relativePath.split(sep);
  
  // 查找项目文件夹的索引
  const projectFolderIndex = parts.findIndex(part => part === projectFolder);
  
  // 如果找不到项目文件夹，返回空字符串
  if (projectFolderIndex === -1) return '';
  
  // 提取从项目文件夹之后的所有部分
  const relevantParts = parts.slice(projectFolderIndex + 1);
  
  // 过滤掉"store"部分
  const filteredParts = relevantParts.filter(part => part !== 'store');
  
  // 获取最后一部分（文件名）并去掉扩展名
  if (filteredParts.length > 0) {
    const lastIndex = filteredParts.length - 1;
    const fileName = filteredParts[lastIndex];
    filteredParts[lastIndex] = basename(fileName, '.ts');
  }
  
  // 将这些部分重新连接成路径
  return filteredParts.join('/');
}

module.exports = (api, options) => {
  api.applyPlugins((config) => {
    // 检查 @mooljs/plugin-layout 插件是否存在，且 @mooljs/plugin-access 插件尚未添加
    config.plugins.push({
      name: "@mooljs/plugin-store",
      after: [],
      injectImports: (opt) => {
        return [`import { setupStore } from 'virtual:store';`];
      },
      // 运行时逻辑
      runtime: (ctx) => `
            app.use(setupStore,{
              initialState:(await config.getInitialState?.()) ?? {}
            });
          `,
      // 虚拟模块定义
      virtualModule: () => ({
        id: "virtual:store",
        content: readFileSync(
          api.resolve("node_modules/@mooljs/plugin-store/dist/store.mjs"),
          "utf-8",
        ),
      }),
      injectMool: () => {
        return [`export { useStore } from 'virtual:store';`];
      },
      injectModuleType: () => {
        const storeFiles = readdirSync(api.resolve('src/store'))
          .filter((file) => file.endsWith(".ts"))
          .map((file) => file.replace(".ts", ""));
        let relativePath = [];
      // 查找所有store文件夹中的ts文件
      try {
         const pageStoreFiles = findTsFilesInStoreDirectories(api.resolve('src/pages'));
         relativePath = pageStoreFiles.map(file => extractPathFromSrc(file));
      } catch (error) {
        console.error(error);
      }
         const pageStoreTypes = relativePath
          .map(
            (module) => `    '${extractPathWithoutStore(module,'pages').replaceAll('/','.')}': ReturnType<typeof import("${module}")['default']>;\n`,
          ).join("");
        const moduleTypes = storeFiles
          .map(
            (module) => `    ${module}: ReturnType<typeof import("src/store/${module}")['default']>;\n`,
          ).concat(pageStoreTypes,[`    '@@initialState':ReturnType<(typeof import("src/app.ts"))["getInitialState"]|(typeof import("src/app.tsx"))["getInitialState"]>;`])
          .join("");
        return [
          `  interface StoreModule {\n${moduleTypes}\n  }\n  export const useStore: <K extends keyof StoreModule>(_namespace: K) => StoreModule[K]`
        ]
      }
    });
  });
};
