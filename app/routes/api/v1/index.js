const express = require("express");
const v1 = express.Router();

v1.use("/auth", require("./AuthenticationRouter"));

v1.use("/positions", require("./PositionRouter"));
v1.use("/employees", require("./EmployeeRouter"));
v1.use("/users", require("./UserRouter"));
v1.use("/departments", require("./DepartmentRouter"));
v1.use("/vehicles", require("./VehicleRouter"));
v1.use("/drivers", require("./DriverRouter"));
v1.use("/service-requests", require("./ServiceRequestRouter"));
v1.use("/work-orders", require("./WorkOrderRouter"));
v1.use("/spare-parts", require("./SparPartRouter"));

module.exports = v1;
