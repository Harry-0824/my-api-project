const Sequelize = require('sequelize');
require('dotenv').config();

// 解析連線參數
const isProduction = process.env.NODE_ENV === 'production';
const dbHost = process.env.DB_HOST || 'localhost';

// 預設連線選項
const sequelizeOptions = {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// 如果在生產環境 (Cloud Run) 且 DB_HOST 是以 /cloudsql/ 開頭 (Unix Socket 連線)
if (isProduction && dbHost.startsWith('/cloudsql/')) {
  // 在 Cloud Run 內部連線 Cloud SQL，需使用 socketPath 而非 host
  delete sequelizeOptions.host;
  sequelizeOptions.socketPath = dbHost;
}

// 初始化 Sequelize 實例
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || process.env.DB_PASSWORD, // 支援環境變數中的 DB_PASS 或 DB_PASSWORD
  sequelizeOptions
);

module.exports = sequelize;
