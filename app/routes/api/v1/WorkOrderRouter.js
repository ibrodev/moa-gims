const express = require("express");
const WorkOrderController = require("../../../controllers/WorkOrderController");
const authenticated = require("../../../middlewares/authenticated");
const WorkOrderRouter = express.Router();

// WorkOrderRouter.use(authenticated);

// Find all work orders
WorkOrderRouter.get("/", WorkOrderController.findAll);

// Find work order by id
WorkOrderRouter.get("/:id", WorkOrderController.findById);

// Create a new work order
WorkOrderRouter.post("/", WorkOrderController.create);

// Update work order
WorkOrderRouter.put("/:id", WorkOrderController.update);

// Delete work order
WorkOrderRouter.delete("/:id", WorkOrderController.delete);

// Mark work order as started
WorkOrderRouter.put("/:id/start", WorkOrderController.start);

// Mark work order as ended
WorkOrderRouter.put("/:id/end", WorkOrderController.end);

// Add additional faults to work order
WorkOrderRouter.put("/:id/add-faults", WorkOrderController.addFaults);

// Count work orders
// WorkOrderRouter.get("/count", WorkOrderController.count);

module.exports = WorkOrderRouter;
