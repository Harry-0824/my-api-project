require("dotenv").config(); // 載入環境變數
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// 引入路由
const modelsRouter = require("./routes/models");
const trimsRouter = require("./routes/trims");

// 中介軟體
app.use(express.json());

// 掛載路由
app.use("/api/models", modelsRouter);
app.use("/api/trims", trimsRouter);

// 測試用路由
app.get("/api/hello", (req, res) => {
  const name = req.query.name || "World";
  res.status(200).json({
    message: "GET 請求成功！",
    data: `Hello, ${name}!`,
  });
});

app.listen(port, () => {
  console.log(`伺服器已啟動，正在監聽 http://localhost:${port}`);
});
