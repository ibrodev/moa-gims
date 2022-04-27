const VehicleModel = require("../models").Vehicle;
const EmployeeModel = require("../models").Employee;
const validator = require("validator");

module.exports = {
  // Find all vehicles
  findAll: async (req, res, next) => {
    try {
      const vehicles = await VehicleModel.findAll();
      res.status(200).json(vehicles);
    } catch (error) {
      next(error);
    }
  },

  // Find vehicle by id
  findById: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      const vehicle = await VehicleModel.findByPk(id);

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
      } = req.body;

      plateNo = plateNo && validator.escape(validator.trim(plateNo));
      manufacturer =
        manufacturer && validator.escape(validator.trim(manufacturer));
      model = model && validator.escape(validator.trim(model));
      engineNo = engineNo && validator.escape(validator.trim(engineNo));
      engineCapacity =
        engineCapacity && validator.escape(validator.trim(engineCapacity));
      engineType = engineType && validator.escape(validator.trim(engineType));
      chassisNo = chassisNo && validator.escape(validator.trim(chassisNo));

      const vehicle = await VehicleModel.create({
        plateNo,
        manufacturer,
        model,
        engineNo,
        engineCapacity,
        engineType,
        chassisNo,
      });
      res.status(201).json(vehicle.id);
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
      } = req.body;

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

      await vehicle.update({
        plateNo: plateNo || undefined,
        manufacturer: manufacturer || undefined,
        model: model || undefined,
        engineNo: engineNo || undefined,
        engineCapacity: engineCapacity || undefined,
        engineType: engineType || undefined,
        chassisNo: chassisNo || undefined,
      });

      res.status(201).json(vehicle.id);
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
