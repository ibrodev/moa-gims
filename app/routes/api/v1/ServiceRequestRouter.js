const express = require("express");
const ServiceRequestController = require("../../../controllers/ServiceRequestController");
const authenticated = require("../../../middlewares/authenticated");
const ServiceRequestRouter = express.Router();

// ServiceRequestRouter.use(authenticated);

// Find all service requests
ServiceRequestRouter.get("/", ServiceRequestController.findAll);

// Find service request by id
ServiceRequestRouter.get("/:id", ServiceRequestController.findById);

// Create a new service request
ServiceRequestRouter.post("/", ServiceRequestController.create);

// Update service request
ServiceRequestRouter.put("/:id", ServiceRequestController.update);

// Delete service request
ServiceRequestRouter.delete("/:id", ServiceRequestController.delete);

// Count service requests
ServiceRequestRouter.get("/count", ServiceRequestController.count);

// update odometer reading
ServiceRequestRouter.put(
  "/:id/update-odometer-reading",
  ServiceRequestController.updateOdometerReading
);

// assign inspector
ServiceRequestRouter.put(
  "/:id/assign-inspector",
  ServiceRequestController.assignInspector
);

// accept service request
ServiceRequestRouter.put("/:id/accept", ServiceRequestController.accept);

// Reset user password
// ServiceRequestRouter.put("/:id/reset-password", ServiceRequestController.resetPassword);

module.exports = ServiceRequestRouter;
