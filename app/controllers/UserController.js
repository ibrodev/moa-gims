const UserModel = require("../models").User;
const EmployeeModel = require("../models").Employee;
const validator = require("validator");

module.exports = {
  // Find all users
  findAll: async (req, res, next) => {
    try {
      const users = await UserModel.findAll({
        include: [
          {
            model: EmployeeModel,
          },
        ],
      });
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  // Find user by id
  findById: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      const user = await UserModel.findByPk(id, {
        include: [
          {
            model: EmployeeModel,
          },
        ],
      });

      if (!user) return res.sendStatus(404);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  // Create a new user
  create: async (req, res, next) => {
    try {
      let {
        username = null,
        password = null,
        role = null,
        employeeId = null,
      } = req.body;

      username = username && validator.escape(validator.trim(username));

      const user = await UserModel.create({
        username,
        password,
        role,
        employeeId,
      });
      res.status(201).json(user.id);
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
          errors: [{ path: "employeeId", message: "employee does not exist" }],
        });
      }
      next(error);
    }
  },

  // Update user
  update: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      let { username = null, role = null, employeeId = null } = req.body;

      username = username && validator.escape(validator.trim(username));

      const user = await UserModel.findByPk(id);
      if (!user) return res.sendStatus(404);

      await user.update({
        username: username || undefined,
        role: role || undefined,
        employeeId: employeeId || undefined,
      });

      res.status(201).json(user.id);
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
          errors: [{ path: "employeeId", message: "employee does not exist" }],
        });
      }

      if (error.name === "NoChangesDetectedError")
        return res.status(200).json({ message: "user not updated" });

      next(error);
    }
  },

  // Delete user
  delete: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      const user = await UserModel.findByPk(id);
      if (!user) return res.sendStatus(404);

      await user.destroy();
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },

  // Count all users
  count: async (req, res, next) => {
    try {
      const count = await UserModel.count();
      res.status(200).json(count);
    } catch (error) {
      next(error);
    }
  },

  // reset user password
  resetPassword: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      const user = await UserModel.findByPk(id);
      if (!user) return res.sendStatus(404);

      const { password } = req.body;

      await user.update({
        password,
      });

      res.status(200).json(user.id);
    } catch (error) {
      next(error);
    }
  },
};
