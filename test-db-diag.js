const oldDb = require('./config/db');
const { sequelize } = require('./models');

// 測試舊有資料庫設定 (使用 mysql2 直接連線)
async function testOld() {
  try {
    console.log("Testing Old Config (mysql2)... (測試舊設定)");
    const [rows] = await oldDb.query('SELECT 1 + 1 AS result');
    console.log("Old Config SUCCESS (舊設定成功):", rows[0]);
  } catch (err) {
    console.error("Old Config FAILED (舊設定失敗):", err.message);
  }
}

// 測試新資料庫設定 (使用 Sequelize ORM)
async function testNew() {
  try {
    console.log("Testing New Config (Sequelize)... (測試新設定)");
    await sequelize.authenticate();
    console.log("New Config SUCCESS (新設定成功)");
  } catch (err) {
    console.error("New Config FAILED (新設定失敗):", err.message);
  }
}

// 執行測試
async function run() {
  await testOld();
  console.log("---");
  await testNew();
  process.exit(0); // 測試完成後結束程式
}

run();
