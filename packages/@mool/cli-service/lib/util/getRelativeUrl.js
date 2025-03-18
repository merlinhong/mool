const path = require('path');
module.exports = function relative(_path, relative) {
  return path.relative(
    process.cwd(),
    path.resolve(relative ? process.cwd() : __dirname, _path),
  );
};
