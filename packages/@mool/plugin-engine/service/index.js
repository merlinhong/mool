const express = require("express");
// const generateCode = require('./src/codeGenerator');
const cors = require("cors");
const mainRouter = require("./routes/mainRouter");
const app = express();
// 中间件，用于解析 JSON 请求体
app
  .use(express.json())
  .use(cors())
  .use("/api", mainRouter)

// 启动服务
app.listen(3000, () => {
  console.log(`Server is running at http://localhost:8080`);
});