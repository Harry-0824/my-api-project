require("dotenv").config(); // 載入環境變數

// 啟動前檢查必要的環境變數
if (!process.env.JWT_SECRET) {
  console.error("錯誤：啟動前必須設定 JWT_SECRET 環境變數");
  process.exit(1);
}

const app = require("./app");
const port = process.env.PORT || 3000;
const db = require("./models");

// 檢查資料庫連線
db.sequelize
  .authenticate()
  .then(() => {
    console.log("資料庫連線成功 (Sequelize)");
    // 自動同步資料表結構——僅限開發環境
    if (process.env.NODE_ENV !== "production") {
      db.sequelize.sync({ alter: true }).then(() => {
        console.log("資料表同步完成");
      });
    }
  })
  .catch((err) => {
    console.error("資料庫連線失敗:", err);
  });

app.listen(port, () => {
  console.log(`伺服器已啟動，正在監聽 http://localhost:${port}`);
});
