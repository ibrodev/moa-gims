const express = require("express");
const v1 = express.Router();

v1.use("/positions", require("./PositionRouter"));
v1.use("/employees", require("./EmployeeRouter"));
v1.use("/users", require("./UserRouter"));

module.exports = v1;
