const express = require("express");
const UserController = require("../../../controllers/UserController");
const authenticated = require("../../../middlewares/authenticated");
const UserRouter = express.Router();

UserRouter.use(authenticated);

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

// Reset user password
UserRouter.put("/:id/reset-password", UserController.resetPassword);

// Count all users
UserRouter.get("/count", UserController.count);

module.exports = UserRouter;
