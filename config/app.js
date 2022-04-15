require("dotenv").config();

module.exports = {
  APP_NAME: process.env.APP_NAME || "API Server",
  APP_ENV: process.env.APP_ENV || "development",
  APP_PORT: parseInt(process.env.APP_PORT) || 8000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "access-token-secret",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret",
};
