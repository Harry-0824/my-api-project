const Sequelize = require('sequelize');
require('dotenv').config();

// 初始化 Sequelize 實例，用於連接資料庫
const sequelize = new Sequelize(
  process.env.DB_NAME,      // 資料庫名稱
  process.env.DB_USER,      // 資料庫使用者
  process.env.DB_PASSWORD,  // 使用者密碼
  {
    host: process.env.DB_HOST, // 資料庫主機位置
    dialect: 'mysql',          // 使用的資料庫類型
    logging: false,            // 是否在控制台顯示 SQL 查詢 (除錯時可設為 console.log)
    pool: {
      max: 10,     // 最大連線數
      min: 0,      // 最小連線數
      acquire: 30000, // 取得連線最大等待時間 (毫秒)
      idle: 10000     // 連線閒置釋放時間 (毫秒)
    }
  }
);

module.exports = sequelize;
