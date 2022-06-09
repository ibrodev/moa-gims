const VehicleModel = require("../models").Vehicle;
const VehicleTypeModel = require("../models").VehicleType;
const EmployeeModel = require("../models").Employee;
const ServiceRequestModel = require("../models").ServiceRequest;
const DriverModel = require("../models").Driver;
const WorkOrderModel = require("../models").WorkOrder;
const FaultModel = require("../models").Fault;
const SparePartModel = require("../models").SparePart;
const PerformedTaskModel = require("../models").PerformedTask;
const validator = require("validator");
const { sequelize } = require("../models");

module.exports = {
  // Find all vehicles
  findAll: async (req, res, next) => {
    try {
      const vehicles = await VehicleModel.findAll({
        include: [
          {
            model: VehicleTypeModel,
            as: "vehicleType",
          },
          {
            model: ServiceRequestModel,
          },
        ],
      });
      res.status(200).json(vehicles);
    } catch (error) {
      next(error);
    }
  },

  findTypes: async (req, res, next) => {
    try {
      const vehicleTypes = await VehicleTypeModel.findAll();
      res.status(200).json(vehicleTypes);
    } catch (error) {
      next(error);
    }
  },

  // Find vehicle by id
  findById: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      const vehicle = await VehicleModel.findByPk(id, {
        order: [[ServiceRequestModel, "createdAt", "DESC"]],
        include: [
          {
            model: VehicleTypeModel,
            as: "vehicleType",
          },
          {
            model: ServiceRequestModel,
            include: [
              { model: EmployeeModel },
              { model: DriverModel },
              { model: FaultModel, as: "faults" },
              {
                model: WorkOrderModel,
                include: [
                  { model: SparePartModel },
                  { model: PerformedTaskModel },
                  { model: EmployeeModel },
                ],
              },
            ],
          },
        ],
      });

      if (!vehicle) return res.sendStatus(404);

      res.status(200).json(vehicle);
    } catch (error) {
      next(error);
    }
  },

  // Create a new vehicle
  create: async (req, res, next) => {
    try {
      let {
        plateNo = null,
        manufacturer = null,
        model = null,
        engineNo = null,
        engineCapacity = null,
        engineType = null,
        chassisNo = null,
        vehicleTypeId = null,
        project = null,
      } = req.body;

      if (typeof vehicleTypeId === "string")
        vehicleTypeId = validator.escape(validator.trim(vehicleTypeId));
      if (!vehicleTypeId)
        throw {
          err: { path: "vehicleTypeId", message: "Vehicle Type is Required" },
        };

      plateNo = plateNo && validator.escape(validator.trim(plateNo));
      manufacturer =
        manufacturer && validator.escape(validator.trim(manufacturer));
      model = model && validator.escape(validator.trim(model));
      engineNo = engineNo && validator.escape(validator.trim(engineNo));
      engineType = engineType && validator.escape(validator.trim(engineType));
      chassisNo = chassisNo && validator.escape(validator.trim(chassisNo));

      const result = await sequelize.transaction(async (t) => {
        if (
          typeof vehicleTypeId === "string" &&
          isNaN(parseInt(vehicleTypeId))
        ) {
          let { id } = await VehicleTypeModel.create(
            { name: vehicleTypeId },
            { transaction: t }
          );
          vehicleTypeId = id;
        }
        const vehicle = await VehicleModel.create(
          {
            plateNo,
            manufacturer,
            model,
            engineNo,
            engineCapacity,
            engineType,
            chassisNo,
            vehicleTypeId,
            project,
          },
          { transaction: t }
        );
        return vehicle;
      });

      res.status(201).json(result.id);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          errors: error.errors?.map((err) => {
            return {
              path: err.path === "name" ? "vehicleType" : err.path,
              message: err.message,
            };
          }),
        });
      }
      if (error.name === "SequelizeForeignKeyConstraintError")
        return res
          .status(400)
          .json({ path: "vehicleTypeId", message: "Invalid Vehicle Type Id" });
      if (error.err) return res.status(400).json(error.err);
      next(error);
    }
  },

  // Update vehicle
  update: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      let {
        plateNo = null,
        manufacturer = null,
        model = null,
        engineNo = null,
        engineCapacity = null,
        engineType = null,
        chassisNo = null,
        vehicleTypeId = null,
        project = null,
      } = req.body;

      if (typeof vehicleTypeId === "string")
        vehicleTypeId = validator.escape(validator.trim(vehicleTypeId));

      plateNo = plateNo && validator.escape(validator.trim(plateNo));
      manufacturer =
        manufacturer && validator.escape(validator.trim(manufacturer));
      model = model && validator.escape(validator.trim(model));
      engineNo = engineNo && validator.escape(validator.trim(engineNo));
      engineCapacity =
        engineCapacity && validator.escape(validator.trim(engineCapacity));
      engineType = engineType && validator.escape(validator.trim(engineType));
      chassisNo = chassisNo && validator.escape(validator.trim(chassisNo));

      const vehicle = await VehicleModel.findByPk(id);
      if (!vehicle) return res.sendStatus(404);

      const result = await sequelize.transaction(async (t) => {
        if (
          typeof vehicleTypeId === "string" &&
          parseInt(vehicleTypeId) === NaN
        ) {
          let { id } = await VehicleTypeModel.create(
            { name: vehicleTypeId },
            { transaction: t }
          );
          vehicleTypeId = id;
        }
        const updatedVehicle = await vehicle.update({
          plateNo: plateNo || undefined,
          manufacturer: manufacturer || undefined,
          model: model || undefined,
          engineNo: engineNo || undefined,
          engineCapacity: engineCapacity || undefined,
          engineType: engineType || undefined,
          chassisNo: chassisNo || undefined,
          vehicleTypeId: vehicleTypeId || undefined,
          project: project || undefined,
        });

        return updatedVehicle;
      });

      res.status(201).json(result.id);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          errors: error.errors?.map((err) => {
            return {
              path: err.path === "name" ? "vehicleType" : err.path,
              message: err.message,
            };
          }),
        });
      }

      if (error.name === "NoChangesDetectedError")
        return res.status(200).json({ message: "user not updated" });

      if (error.name === "SequelizeForeignKeyConstraintError")
        return res
          .status(400)
          .json({ path: "vehicleTypeId", message: "Invalid Vehicle Type Id" });
      if (error.err) return res.status(400).json(error.err);
      next(error);
    }
  },

  // Delete vehicle
  // delete: async (req, res, next) => {
  //   try {
  //     let { id } = req.params;
  //     if (isNaN(id)) return next();

  //     const vehicle = await VehicleModel.findByPk(id);
  //     if (!vehicle) return res.sendStatus(404);

  //     await vehicle.destroy();
  //     res.sendStatus(204);
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  // Count all vehicles
  count: async (req, res, next) => {
    try {
      const count = await VehicleModel.count();
      res.status(200).json(count);
    } catch (error) {
      next(error);
    }
  },
};
