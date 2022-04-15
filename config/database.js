require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME || "root",
    password: process.env.DEV_DB_PASSWORD || "",
    database: process.env.DEV_DB_DATABASE || "",
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 5432,
    dialect: process.env.DEV_DB_DIALECT || "postgres",
    options: {
      logging: process.env.DEV_DB_LOGGING || true,
    },
  },
  test: {
    username: process.env.TEST_DB_USERNAME || "root",
    password: process.env.TEST_DB_PASSWORD || "",
    database: process.env.TEST_DB_DATABASE || "",
    host: process.env.TEST_DB_HOST || "localhost",
    port: process.env.TEST_DB_PORT || 5432,
    dialect: process.env.TEST_DB_DIALECT || "postgres",
    options: {
      logging: process.env.TEST_DB_LOGGING || true,
    },
  },
  production: {
    username: process.env.PROD_DB_USERNAME || "root",
    password: process.env.PROD_DB_PASSWORD || "",
    database: process.env.PROD_DB_DATABASE || "",
    host: process.env.PROD_DB_HOST || "localhost",
    port: process.env.PROD_DB_PORT || 5432,
    dialect: process.env.PROD_DB_DIALECT || "postgres",
    options: {
      logging: process.env.PROD_DB_LOGGING || true,
    },
  },
};
