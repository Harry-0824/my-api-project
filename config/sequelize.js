const Sequelize = require("sequelize");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const dbHost = process.env.DB_HOST || "localhost";

if (!isProduction) {
  console.log("--- Database Config ---");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("DB_HOST:", dbHost);
}

const sequelizeOptions = {
  dialect: "mysql",
  logging: process.env.NODE_ENV === "production" ? false : console.log,
};

// ?ôÊòØ Cloud Run Ë¶ÅÊ???Socket ????πÂ?
if (isProduction && dbHost.startsWith("/cloudsql/")) {
  sequelizeOptions.host = dbHost; // ?åÊ?Â∞?host Ë®≠ÁÇ∫ socket Ë∑ØÂ?
  sequelizeOptions.dialectOptions = {
    socketPath: dbHost,
  };
} else {
  sequelizeOptions.host = dbHost;
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || process.env.DB_PASSWORD,
  sequelizeOptions,
);

module.exports = sequelize;
