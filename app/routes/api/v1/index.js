const express = require("express");
const v1 = express.Router();

v1.use("/positions", require("./PositionRouter"));

module.exports = v1;
