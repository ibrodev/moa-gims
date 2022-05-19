const express = require("express");
const SparePartController = require("../../../controllers/SparePartController");
const authenticated = require("../../../middlewares/authenticated");
const SparePartRouter = express.Router();

// SparePartRouter.use(authenticated);

// Find all spare parts
SparePartRouter.get("/", SparePartController.findAll);

// Find spare part by id
SparePartRouter.get("/:id", SparePartController.findById);

// Create a new spare part
SparePartRouter.post("/", SparePartController.create);

// Update spare part
SparePartRouter.put("/:id", SparePartController.update);

// Delete spare part
SparePartRouter.delete("/:id", SparePartController.delete);

module.exports = SparePartRouter;
