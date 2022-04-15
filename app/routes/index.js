const express = require("express");
const indexRouter = express.Router();

indexRouter.get("/", (req, res, next) => {
  res.send("<h1>Use /api/[version-number]/resource</h1>");
});

indexRouter.use("/api", require("./api"));

module.exports = indexRouter;
