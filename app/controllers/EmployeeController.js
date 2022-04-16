const EmployeeModel = require("../models").Employee;
const PositionModel = require("../models").Position;
const validator = require("validator");

module.exports = {
  // Find all employees
  findAll: async (req, res, next) => {
    try {
      const employees = await EmployeeModel.findAll({
        include: [
          {
            model: PositionModel,
          },
        ],
      });
      res.json(employees);
    } catch (error) {
      next(error);
    }
  },

  // Find employee by id
  findById: async (req, res, next) => {
    try {
      let { id } = req.params;

      if (isNaN(id)) return next();

      const employee = await EmployeeModel.findByPk(id, {
        include: [
          {
            model: PositionModel,
          },
        ],
      });

      if (!employee) return res.sendStatus(404);

      res.json(employee);
    } catch (error) {
      next(error);
    }
  },

  // Create new employee
  create: async (req, res, next) => {
    try {
      let { firstName = null, lastName = null, positionId } = req.body;

      // sanitize name input
      firstName = firstName && validator.escape(validator.trim(firstName));
      lastName = lastName && validator.escape(validator.trim(lastName));

      const employee = await EmployeeModel.create({
        firstName,
        lastName,
        positionId,
      });
      res.status(201).json(employee.id);
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

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          errors: [{ path: "positionId", message: "Position does not exist" }],
        });
      }

      return next(error);
    }
  },

  // Update employee
  update: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { firstName = null, lastName = null, positionId = null } = req.body;

      if (isNaN(id)) return next();

      firstName = firstName && validator.escape(validator.trim(firstName));
      lastName = lastName && validator.escape(validator.trim(lastName));

      const employee = await EmployeeModel.findByPk(id);
      if (!employee) return res.sendStatus(404);

      await employee.update({
        firstName,
        lastName,
        positionId,
      });
      res.status(201).json(employee.id);
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

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          errors: [{ path: "positionId", message: "Position does not exist" }],
        });
      }

      return next(error);
    }
  },

  // Delete employee
  delete: async (req, res, next) => {
    try {
      let { id } = req.params;

      if (isNaN(id)) return next();

      const employee = await EmployeeModel.findByPk(id);
      if (!employee) return res.sendStatus(404);

      await employee.destroy();
      res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  },

  // count employees
  count: async (req, res, next) => {
    try {
      const count = await EmployeeModel.count();
      res.json(count);
    } catch (error) {
      return next(error);
    }
  },
};
