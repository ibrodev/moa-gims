const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

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
  res.sendStatus(404);
});

// log error to console
app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(err?.status || 500);
});

module.exports = app;
