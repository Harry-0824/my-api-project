const Sequelize = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const dbHost = process.env.DB_HOST || 'localhost';

console.log('--- Database Config ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', dbHost);

const sequelizeOptions = {
  dialect: 'mysql',
  logging: console.log, // 生產環境排錯時可暫時開啟，看它嘗試連接哪個路徑
};

// 這是 Cloud Run 要求的 Socket 連線方式
if (isProduction && dbHost.startsWith('/cloudsql/')) {
  sequelizeOptions.dialectOptions = {
    socketPath: dbHost // 這裡會變成 /cloudsql/my-mg-backend:asia-east1:mg-api-db
  };
  // 注意：使用 socketPath 時，通常不需要設定 host 屬性
} else {
  sequelizeOptions.host = dbHost;
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || process.env.DB_PASSWORD,
  sequelizeOptions
);

module.exports = sequelize;
