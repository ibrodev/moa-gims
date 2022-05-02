const ServiceRequestModel = require("../models").ServiceRequest;
const EmployeeModel = require("../models").Employee;
const VehicleModel = require("../models").Vehicle;
const DriverModel = require("../models").Driver;
const DepartmentModel = require("../models").Department;
const FaultModel = require("../models").Fault;
const validator = require("validator");
const { sequelize } = require("../models");
const { Transaction } = require("sequelize");

module.exports = {
  // Find all service requests
  findAll: async (req, res, next) => {
    try {
      const serviceRequest = await ServiceRequestModel.findAll({
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
      let {
        vehicleId = null,
        departmentId = null,
        driverId = null,
        faults = null,
        status = null,
      } = req.body;

      const result = await sequelize.transaction(async (t) => {
        const serviceRequest = await ServiceRequestModel.create(
          {
            vehicleId,
            departmentId,
            driverId,
            status: status || undefined,
          },
          { transaction: t }
        );
        const faultObjects = faults.map((fault) => ({
          description: fault.description,
          serviceRequestId: serviceRequest.id,
          type: "initial",
        }));
        await FaultModel.bulkCreate([...faultObjects], {
          validate: true,
          transaction: t,
        });
        return serviceRequest;
      });

      res.status(201).json(result.id);
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

      let { vehicleId, departmentId, driverId, status } = req.body;

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
        return res.status(200).json({ message: "user not updated" });

      next(error);
    }
  },

  // update faults
  // updateFaults: async (req, res, next) => {
  //   try {

  //     let { id } = req.params;
  //     if (isNaN(id)) return next();

  //     let { faults = null } = req.body;

  //     const serviceRequest = await ServiceRequestModel.findByPk(id);

  //     if (!serviceRequest) return res.sendStatus(404);

  //     if (serviceRequest.status !== "draft")
  //       return res
  //         .status(400)
  //         .json({ errors: { message: "Service Request cannot be updated" } });

  //     const result = await sequelize.transaction(async (t) => {

  //       faults.forEach(fault => await FaultModel.update({where: {id: fault.id}, description: fault.description}, { transaction: t }));
  //       return true;
  //     })

  //   } catch(error) {

  //     next(error)
  //   }
  // },

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
          .json({ errors: { message: "Service Request cannot be updated" } });

      const result = await sequelize.transaction(async (t) => {
        const sr = await serviceRequest.destroy({ transaction: t });
        await FaultModel.destroy(
          { where: { serviceRequestId: id } },
          { transaction: t }
        );
        return sr;
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

  // set odometer reading
  updateOdometerReading: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      let { odometerReading = null } = req.body;

      // if (!odometerReading)
      //   return res.status(400).json({
      //     errors: {
      //       path: "odometerReading",
      //       message: "Odometer Reading can't be empty",
      //     },
      //   });

      const serviceRequest = await ServiceRequestModel.findByPk(id);

      if (!serviceRequest) return res.sendStatus(404);

      await serviceRequest.update({ odometerReading });
      res.status(201).json(serviceRequest.id);
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
      const serviceRequest = await ServiceRequestModel.findByPk(id);
      if (!serviceRequest) return res.sendStatus(404);

      await serviceRequest.update({ status: "accepted" });
      res.status(201).json(serviceRequest.id);
    } catch (error) {
      next(error);
    }
  },
};
