const createErrors = require("http-errors");
const PositionModel = require("../models/").Position;
const validator = require("validator");

module.exports = {
  // Find all positions
  findAll: async (req, res, next) => {
    try {
      const positions = await PositionModel.findAll();
      res.json(positions);
    } catch (error) {
      next(error);
    }
  },

  // Find position by id
  findById: async (req, res, next) => {
    try {
      let { id } = req.params;

      if (isNaN(id)) return next();

      const position = await PositionModel.findByPk(id);

      if (!position) return res.sendStatus(404);

      res.json(position);
    } catch (error) {
      next(error);
    }
  },

  // Create new position
  create: async (req, res, next) => {
    try {
      let { name = null } = req.body;

      // sanitize name input
      name = name && validator.escape(validator.trim(name));

      const position = await PositionModel.create({ name });
      res.status(201).json(position.id);
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

      return next(error);
    }
  },

  // Update position
  update: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { name = null } = req.body;

      if (isNaN(id)) return res.sendStatus(404);

      name = name && validator.escape(validator.trim(name));

      const position = await PositionModel.findByPk(id);
      if (!position) return res.sendStatus(404);

      await position.update({ name });
      res.status(201).json(position.id);
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

  // count positions
  count: async (req, res, next) => {
    try {
      const count = await PositionModel.count();
      res.json(count);
    } catch (error) {
      next(error);
    }
  },
};
