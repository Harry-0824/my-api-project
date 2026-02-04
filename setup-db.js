require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
  });

  try {
    const dbName = process.env.DB_NAME || 'mg_website_db';
    console.log(`正在建立資料庫: ${dbName}...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`成功！資料庫 "${dbName}" 已準備就緒。`);
  } catch (err) {
    console.error('建立資料庫失敗:', err.message);
  } finally {
    await connection.end();
  }
}

setupDatabase();
