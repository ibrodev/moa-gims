const express = require("express");
const EmployeesController = require("../../../controllers/EmployeeController");
const EmployeeRouter = express.Router();

// find all employees
EmployeeRouter.get("/", EmployeesController.findAll);

// find employee by id
EmployeeRouter.get("/:id", EmployeesController.findById);

// create new employee
EmployeeRouter.post("/", EmployeesController.create);

// update employee
EmployeeRouter.put("/:id", EmployeesController.update);

// delete employee
EmployeeRouter.delete("/:id", EmployeesController.delete);

// count employees
EmployeeRouter.get("/count", EmployeesController.count);

module.exports = EmployeeRouter;
