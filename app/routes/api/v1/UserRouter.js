const express = require("express");
const UserController = require("../../../controllers/UserController");
const UserRouter = express.Router();

// Find all users
UserRouter.get("/", UserController.findAll);

// Find user by id
UserRouter.get("/:id", UserController.findById);

// Create a new user
UserRouter.post("/", UserController.create);

// Update user
UserRouter.put("/:id", UserController.update);

// Delete user
UserRouter.delete("/:id", UserController.delete);

// Count users
UserRouter.get("/count", UserController.count);

module.exports = UserRouter;
