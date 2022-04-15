const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");

const { APP_ENV } = require("../config/app.js");

const app = express();

// setting configuration
app.set("env", APP_ENV);
app.set("x-powered-by", false);

// app middlewares
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morgan("tiny"));
app.use(express.json());

// use index router
app.use(require("./routes/index"));

// send 404 NotFound
app.use((req, res, next) => {
  next(createError.NotFound());
});

// log error to console
app.use((err, req, res, next) => {
  let status = err.status || 500;

  if (app.get("env") === "development") {
    return res.status(status).json({
      name: err.name || "",
      message: err.message || "",
      stack: err.stack || "",
    });
  }

  err.message =
    err.status === 500 ? "Internal Server Error" : err.message || "";

  console.log(err);
  return res.status(status).json({ message: err.message });
});

module.exports = app;
