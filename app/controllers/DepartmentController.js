const createErrors = require("http-errors");
const DepartmentModel = require("../models").Department;
const validator = require("validator");

module.exports = {
  // Find all Departments
  findAll: async (req, res, next) => {
    try {
      const departments = await DepartmentModel.findAll();
      res.json(departments);
    } catch (error) {
      next(error);
    }
  },

  // Find department by id
  findById: async (req, res, next) => {
    try {
      let { id } = req.params;

      if (isNaN(id)) return next();

      const department = await DepartmentModel.findByPk(id);

      if (!department) return res.sendStatus(404);

      res.json(department);
    } catch (error) {
      next(error);
    }
  },

  // Create new department
  create: async (req, res, next) => {
    try {
      let { name = null } = req.body;

      // sanitize name input
      name = name && validator.escape(validator.trim(name));

      const department = await DepartmentModel.create({ name });
      res.status(201).json(department.id);
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

  // Update department
  update: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { name = null } = req.body;

      if (isNaN(id)) return res.sendStatus(404);

      name = name && validator.escape(validator.trim(name));

      const department = await DepartmentModel.findByPk(id);
      if (!department) return res.sendStatus(404);

      await department.update({ name: name || undefined });
      res.status(201).json(department.id);
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
          message: "position not updated",
        });
      next(error);
    }
  },

  // Delete department
  delete: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      const department = await DepartmentModel.findByPk(id);
      if (!department) return res.sendStatus(404);

      await department.destroy();
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },

  // count department
  count: async (req, res, next) => {
    try {
      const count = await DepartmentModel.count();
      res.json(count);
    } catch (error) {
      next(error);
    }
  },
};
