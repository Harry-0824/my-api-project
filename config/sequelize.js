const Sequelize = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const dbHost = process.env.DB_HOST || 'localhost';

console.log('--- Database Config ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', dbHost);

const sequelizeOptions = {
  dialect: 'mysql',
  logging: false,
};

// 這是 Cloud Run 要求的 Socket 連線方式
if (isProduction && dbHost.startsWith('/cloudsql/')) {
  sequelizeOptions.dialectOptions = {
    socketPath: dbHost
  };
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
