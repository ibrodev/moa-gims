const express = require("express");
const apiV1Router = express.Router();

apiV1Router.use("/users", require("./UsersRouter"));

module.exports = apiV1Router;
