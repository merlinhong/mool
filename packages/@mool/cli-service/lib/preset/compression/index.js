import compressPlugin from "vite-plugin-compression";
import merge from 'lodash.merge';
module.exports = (api,options)=>{
    const compressPluginOption = {
        verbose: true, // 是否在控制台中输出压缩结果
        disable: false, // 是否禁用压缩
        deleteOriginFile: false, // 压缩后是否删除源文件
        threshold: 1024, // 压缩前最小文件大小，单位为字节
        algorithm: 'gzip', // 使用的压缩算法
        ext: '.gz' // 生成的压缩文件后缀
      };
    api.chainVite((config)=>{
       config.plugin.push(compressPlugin(merge(compressPluginOption,options.compression??{})))
    })
}