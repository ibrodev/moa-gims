const express = require("express");
const DriverController = require("../../../controllers/DriverController");
const DriverRouter = express.Router();

DriverRouter.use(require("../../../middlewares/authenticated"));

// Find all drivers
DriverRouter.get("/", DriverController.findAll);

// Find driver by id
DriverRouter.get("/:id", DriverController.findById);

// Create new driver
DriverRouter.post("/", DriverController.create);

// Update driver
DriverRouter.put("/:id", DriverController.update);

// Count drivers
DriverRouter.get("/count", DriverController.count);

module.exports = DriverRouter;
