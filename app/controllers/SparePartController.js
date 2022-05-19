const SparePartModel = require("../models").SparePart;
const WorkOrderModel = require("../models").WorkOrder;
const validator = require("validator");

module.exports = {
  // find all spare parts
  findAll: async (req, res, next) => {
    try {
      const spareParts = await SparePartModel.findAll({
        include: [
          {
            model: WorkOrderModel,
          },
        ],
      });
      res.status(200).json(spareParts);
    } catch (error) {
      next(error);
    }
  },

  // find spare part by id
  findById: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      const sparePart = await SparePartModel.findByPk(id, {
        include: [
          {
            model: WorkOrderModel,
          },
        ],
      });

      if (!sparePart) return res.sendStatus(404);

      res.status(200).json(sparePart);
    } catch (error) {
      next(error);
    }
  },

  // create a new spare part
  create: async (req, res, next) => {
    try {
      let {
        workOrderId = null,
        partName = null,
        partNumber = null,
        quantity = null,
        unitPrice = null,
        returned = null,
      } = req.body;

      partName = partName && validator.escape(validator.trim(partName));
      partNumber = partNumber && validator.escape(validator.trim(partNumber));

      const sparePart = await SparePartModel.create({
        workOrderId,
        partName,
        partNumber,
        quantity,
        unitPrice,
        returned,
      });

      res.status(201).json(sparePart);
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
          errors: [
            { path: "workOrderId", message: "work order does not exist" },
          ],
        });
      }
      next(error);
    }
  },

  // update spare part
  update: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      let {
        workOrderId,
        partName = null,
        partNumber = null,
        quantity,
        unitPrice,
        returned,
      } = req.body;

      partName = partName && validator.escape(validator.trim(partName));
      partNumber = partNumber && validator.escape(validator.trim(partNumber));

      const workOrder = await WorkOrderModel.findByPk(workOrderId);
      if (!workOrder || workOrder.completed)
        throw {
          message:
            "Can't update Spare Part, it is under a completed Work Order",
        };

      const sparePart = await SparePartModel.findByPk(id);
      if (!sparePart) return res.sendStatus(404);

      await sparePart.update({
        workOrderId,
        partName: partName || undefined,
        partNumber: partNumber || undefined,
        quantity,
        unitPrice,
        returned,
      });

      res.status(200).json(sparePart);
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
          errors: [
            { path: "workOrderId", message: "work order does not exist" },
          ],
        });
      }
      next(error);
    }
  },

  // delete spare part
  delete: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      const sparePart = await SparePartModel.findByPk(id);
      if (!sparePart) return res.sendStatus(404);

      const workOrder = await WorkOrderModel.findByPk(sparePart.workOrderId);

      if (workOrder.completed)
        throw {
          message:
            "Can't delete Spare Part, it is under a completed Work Order",
        };

      await sparePart.destroy();

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  },
};
