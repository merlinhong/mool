const { access, constants} = require("fs");
const path = require("path");
function accessFile(filePath) {
    return new Promise((resolve, reject) => {
        access(filePath, constants.F_OK, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(filePath);
            }
        });
    });
}

exports.checkFiles = async function (files=['app.tsx', 'app.ts']) {
    for (const file of files) {
        const filePath = path.resolve(process.cwd(), `src/${file}`);
        try {
            await accessFile(filePath);
            return file; // 找到文件后立即返回，不再继续检查
        } catch (err) {
            // 文件不存在，继续检查下一个文件
        }
    }
    return false
}