module.exports = function () {
  return function (err, req, res, next) {
    console.error(err.stack);
    // 判断状态码
    const status = err.status || 500; // 默认状态码为 500
    const message = err.message || "内部服务器错误"; // 默认错误信息

    res.status(status).json({
      status: status,
      message: message,
    });
  };
};
