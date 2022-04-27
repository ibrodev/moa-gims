const express = require("express");
const VehicleController = require("../../../controllers/VehicleController");
const VehicleRouter = express.Router();

VehicleRouter.use(require("../../../middlewares/authenticated"));

// Find all users
VehicleRouter.get("/", VehicleController.findAll);

// Find user by id
VehicleRouter.get("/:id", VehicleController.findById);

// Create a new user
VehicleRouter.post("/", VehicleController.create);

// Update user
VehicleRouter.put("/:id", VehicleController.update);

// Delete user
// VehicleRouter.delete("/:id", VehicleController.delete);

// Count users
VehicleRouter.get("/count", VehicleController.count);

module.exports = VehicleRouter;
