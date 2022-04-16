const express = require("express");
const UserController = require("../../../controllers/UserController");
const UserRouter = express.Router();

// Find all users
UserRouter.get("/", UserController.findAll);

module.exports = UserRouter;
