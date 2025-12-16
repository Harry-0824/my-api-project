const express = require("express");
const app = express();
const port = 3000;

// 中介軟體 (Middleware)：這行很重要，用來解析 POST 請求中的 JSON 資料
app.use(express.json());

// ==========================
// 1. 測試用的 GET API
// ==========================
app.get("/api/hello", (req, res) => {
  // 這裡可以處理查詢參數 (Query Params)，例如 /api/hello?name=John
  const name = req.query.name || "World";

  res.status(200).json({
    message: "GET 請求成功！",
    data: `Hello, ${name}!`,
  });
});

// ==========================
// 2. 測試用的 POST API
// ==========================
app.post("/api/data", (req, res) => {
  // 取得前端傳過來的 Body 資料
  const receivedData = req.body;

  console.log("收到 POST 資料:", receivedData);

  res.status(200).json({
    message: "POST 請求成功！",
    received: receivedData,
    timestamp: new Date(),
  });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器已啟動，正在監聽 http://localhost:${port}`);
});
