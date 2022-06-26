const ServiceRequestModel = require("../models").ServiceRequest;
const EmployeeModel = require("../models").Employee;
const VehicleModel = require("../models").Vehicle;
const DriverModel = require("../models").Driver;
const DepartmentModel = require("../models").Department;
const WorkOrderModel = require("../models").WorkOrder;
const FaultModel = require("../models").Fault;
const PerformedTaskModel = require("../models").PerformedTask;
const SparePartModel = require("../models").SparePart;
const validator = require("validator");
const { sequelize } = require("../models");
const _ = require("lodash");

module.exports = {
  // Find all service requests
  findAll: async (req, res, next) => {
    try {
      const serviceRequest = await ServiceRequestModel.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: EmployeeModel,
          },
          {
            model: DriverModel,
          },
          {
            model: VehicleModel,
          },
          {
            model: DepartmentModel,
          },
          {
            model: FaultModel,
            as: "faults",
          },
        ],
      });
      res.status(200).json(serviceRequest);
    } catch (error) {
      next(error);
    }
  },

  // Find service request by id
  findById: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      const serviceRequest = await ServiceRequestModel.findByPk(id, {
        include: [
          {
            model: EmployeeModel,
          },
          {
            model: DriverModel,
          },
          {
            model: VehicleModel,
          },
          {
            model: DepartmentModel,
          },
          {
            model: FaultModel,
            as: "faults",
          },
          {
            model: WorkOrderModel,
            include: [
              { model: EmployeeModel },
              { model: FaultModel },
              { model: PerformedTaskModel },
              { model: SparePartModel },
            ],
          },
        ],
      });

      if (!serviceRequest) return res.sendStatus(404);

      res.status(200).json(serviceRequest);
    } catch (error) {
      next(error);
    }
  },

  // Create a new service request
  create: async (req, res, next) => {
    try {
      let { vehicleId = null, departmentId = null, driverId = null } = req.body;

      const serviceRequest = await ServiceRequestModel.create({
        vehicleId,
        departmentId,
        driverId,
      });

      res.status(201).json(serviceRequest.id);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          errors: error.errors?.map((err) => {
            return { path: err.path, message: err.message };
          }),
        });
      }
      next(error);
    }
  },

  // Update service request
  update: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      let { vehicleId, departmentId, driverId, status, odometerReading } =
        req.body;

      const serviceRequest = await ServiceRequestModel.findByPk(id);

      if (!serviceRequest) return res.sendStatus(404);

      if (serviceRequest.status !== "draft")
        return res
          .status(400)
          .json({ errors: { message: "Service Request cannot be updated" } });

      await serviceRequest.update({
        vehicleId,
        departmentId,
        driverId,
        status,
        odometerReading,
      });

      res.status(201).json(serviceRequest.id);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          errors: error.errors?.map((err) => {
            return { path: err.path, message: err.message };
          }),
        });
      }

      if (error.name === "NoChangesDetectedError")
        return res.status(200).json({ message: "service request not updated" });

      next(error);
    }
  },

  // Delete service request
  delete: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      const serviceRequest = await ServiceRequestModel.findByPk(id);
      if (!serviceRequest) return res.sendStatus(404);
      if (serviceRequest.status !== "draft")
        return res
          .status(400)
          .json({ errors: { message: "Service Request cannot be deleted" } });

      const result = await sequelize.transaction(async (t) => {
        await serviceRequest.setFaults(null, { transaction: t });
        await serviceRequest.destroy({ transaction: t });
        return true;
      });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },

  // Count all service requests
  count: async (req, res, next) => {
    try {
      const count = await ServiceRequestModel.count();
      res.status(200).json(count);
    } catch (error) {
      next(error);
    }
  },

  // assign inspector
  assignInspector: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      let { inspectorId = null } = req.body;

      if (!inspectorId)
        return res.status(400).json({
          errors: {
            path: "inspectorId",
            message: "Inspector can't be empty",
          },
        });

      const serviceRequest = await ServiceRequestModel.findByPk(id);

      if (!serviceRequest) return res.sendStatus(404);

      await serviceRequest.update({
        inspectorId,
        status: "pending-inspection",
      });
      res.status(201).json(serviceRequest.id);
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          errors: [
            { path: "inspectorId", message: "Inspector does not exist" },
          ],
        });
      }

      next(error);
    }
  },

  // accept service request
  accept: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      let { odometerReading = null } = req.body;

      if (!odometerReading)
        return res.status(400).json({
          errors: {
            path: "odometerReading",
            message: "Odometer Reading is required",
          },
        });

      const serviceRequest = await ServiceRequestModel.findByPk(id);
      if (!serviceRequest) return res.sendStatus(404);

      await serviceRequest.update({ odometerReading, status: "accepted" });
      res.status(201).json(serviceRequest.id);
    } catch (error) {
      next(error);
    }
  },

  // add faults
  addFaults: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      let { faults } = req.body;

      if (
        !faults ||
        !Array.isArray(faults) ||
        faults.length === 0 ||
        faults.some((fault) => typeof fault !== "string")
      )
        return res.status(400).json({
          errors: {
            path: "faults",
            message:
              "Faults are required and must be an array of atleast one string value",
          },
        });

      const serviceRequest = await ServiceRequestModel.findByPk(id);
      if (!serviceRequest)
        return res
          .status(400)
          .json({ errors: { message: "Service Request does not exist" } });

      if (serviceRequest.status !== "draft")
        return res.status(400).json({
          errors: {
            message:
              "Can't add faults to a service request that is not in draft status",
          },
        });

      await FaultModel.bulkCreate(
        faults.map((fault) => ({
          description: fault,
          serviceRequestId: serviceRequest.id,
        }))
      );

      res.status(201).json(serviceRequest.id);
    } catch (error) {
      next(error);
    }
  },

  // delate faults
  deleteFaults: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      let { faults } = req.body;
      console.log(req.body);

      if (
        !faults ||
        !Array.isArray(faults) ||
        faults.length === 0 ||
        faults.some((fault) => typeof fault !== "number")
      )
        return res.status(400).json({
          errors: {
            path: "faults",
            message:
              "Faults are required and must be an array of integer values and must contain atleast one fault id",
          },
        });

      const serviceRequest = await ServiceRequestModel.findByPk(id);
      if (!serviceRequest)
        return res
          .status(400)
          .json({ errors: { message: "Service Request does not exist" } });

      if (serviceRequest.status !== "draft")
        return res.status(400).json({
          errors: {
            message:
              "Can't delete faults to a service request that is not in draft status",
          },
        });

      await serviceRequest.removeFaults(faults);

      res.status(201).json(serviceRequest.id);
    } catch (error) {
      next(error);
    }
  },

  // complete service request
  complete: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      const serviceRequest = await ServiceRequestModel.findByPk(id);
      if (!serviceRequest)
        return res
          .status(400)
          .json({ errors: { message: "Service Request does not exist" } });

      if (serviceRequest.status !== "accepted")
        return res.status(400).json({
          errors: {
            message: "couldn't complete service request",
          },
        });

      await serviceRequest.update({
        status: "completed",
        completedAt: Date.now(),
      });
      res.status(201).json(serviceRequest.id);
    } catch (error) {
      next(error);
    }
  },
};
