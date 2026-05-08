const Sequelize = require("sequelize");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = parseInt(process.env.DB_PORT || "5432", 10);

if (!isProduction) {
  console.log("--- Database Config ---");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("DB_HOST:", dbHost);
  console.log("DB_PORT:", dbPort);
}

const sequelizeOptions = {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "production" ? false : console.log,
};

if (isProduction && dbHost.startsWith("/cloudsql/")) {
  sequelizeOptions.host = dbHost;
  sequelizeOptions.dialectOptions = {
    socketPath: dbHost,
  };
} else {
  sequelizeOptions.host = dbHost;
  sequelizeOptions.port = dbPort;

  if (isProduction) {
    sequelizeOptions.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    };
  }
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || process.env.DB_PASSWORD,
  sequelizeOptions,
);

module.exports = sequelize;
