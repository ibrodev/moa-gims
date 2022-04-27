const express = require("express");
const authenticated = require("../../../middlewares/authenticated");
const DepartmentController = require("../../../controllers/DepartmentController");
const DepartmentRouter = express.Router();

DepartmentRouter.use(authenticated);

// Find all departments
DepartmentRouter.get("/", DepartmentController.findAll);

// Find department by id
DepartmentRouter.get("/:id", DepartmentController.findById);

// Create new department
DepartmentRouter.post("/", DepartmentController.create);

// Update department
DepartmentRouter.put("/:id", DepartmentController.update);

// delete department

// Count departments
DepartmentRouter.get("/count", DepartmentController.count);

module.exports = DepartmentRouter;
