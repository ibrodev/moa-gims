const createErrors = require("http-errors");
const DriverModel = require("../models/").Driver;
const validator = require("validator");

module.exports = {
  // Find all drivers
  findAll: async (req, res, next) => {
    try {
      const drivers = await DriverModel.findAll();
      res.json(drivers);
    } catch (error) {
      next(error);
    }
  },

  // Find driver by id
  findById: async (req, res, next) => {
    try {
      let { id } = req.params;

      if (isNaN(id)) return next();

      const driver = await DriverModel.findByPk(id);

      if (!driver) return res.sendStatus(404);

      res.json(driver);
    } catch (error) {
      next(error);
    }
  },

  // Create new driver
  create: async (req, res, next) => {
    try {
      let { firstName = null, lastName = null, licenseNo = null } = req.body;

      // sanitize firstName, lastName, and licenseNo input
      firstName = firstName && validator.escape(validator.trim(firstName));
      lastName = lastName && validator.escape(validator.trim(lastName));
      licenseNo = licenseNo && validator.escape(validator.trim(licenseNo));

      const drivers = await DriverModel.create({
        firstName,
        lastName,
        licenseNo,
      });
      res.status(201).json(drivers.id);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          errors: error.errors?.map((err) => {
            return { [err.path]: err.message };
          }),
        });
      }

      return next(error);
    }
  },

  // Update driver
  update: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { firstName = null, lastName = null, licenseNo = null } = req.body;

      if (isNaN(id)) return res.sendStatus(404);

      // sanitize firstName, lastName, and licenseNo input
      firstName = firstName && validator.escape(validator.trim(firstName));
      lastName = lastName && validator.escape(validator.trim(lastName));
      licenseNo = licenseNo && validator.escape(validator.trim(licenseNo));

      const driver = await DriverModel.findByPk(id);
      if (!driver) return res.sendStatus(404);

      await driver.update({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        licenseNo: licenseNo || undefined,
      });
      res.status(201).json(driver.id);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          errors: error.errors?.map((err) => {
            return { [err.path]: err.message };
          }),
        });
      }
      if (error.name === "NoChangesDetectedError")
        return res.status(200).json({
          message: "driver not updated",
        });
      next(error);
    }
  },

  // count positions
  count: async (req, res, next) => {
    try {
      const count = await DriverModel.count();
      res.json(count);
    } catch (error) {
      next(error);
    }
  },
};
