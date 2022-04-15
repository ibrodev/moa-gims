const express = require("express");
const PositionController = require("../../../controllers/PositionController");
const PositionRouter = express.Router();

// Find all positions
PositionRouter.get("/", PositionController.findAll);

// Find position by id
PositionRouter.get("/:id", PositionController.findById);

// Create new position
PositionRouter.post("/", PositionController.create);

// Update position
PositionRouter.put("/:id", PositionController.update);

// Count positions
PositionRouter.get("/count", PositionController.count);

module.exports = PositionRouter;
