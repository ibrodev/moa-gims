const WorkOrderModel = require("../models").WorkOrder;
const ServiceRequestModel = require("../models").ServiceRequest;
const EmployeeModel = require("../models").Employee;
const VehicleModel = require("../models").Vehicle;
const DriverModel = require("../models").Driver;
const FaultModel = require("../models").Fault;
const validator = require("validator");
const { sequelize } = require("../models");
const { Transaction, Op } = require("sequelize");
const _ = require("lodash");

module.exports = {
  // Find all work orders
  findAll: async (req, res, next) => {
    try {
      const workOrders = await WorkOrderModel.findAll({
        include: [
          {
            model: EmployeeModel,
          },
          {
            model: ServiceRequestModel,
            include: [{ model: EmployeeModel }],
          },
          {
            model: FaultModel,
          },
        ],
      });

      res.status(200).json(workOrders);
    } catch (error) {
      next(error);
    }
  },

  // Find work order by id
  findById: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(parseInt(id))) return next();

      const workOrder = await WorkOrderModel.findByPk(id, {
        include: [
          {
            model: EmployeeModel,
          },
          {
            model: ServiceRequestModel,
            include: [
              { model: VehicleModel },
              { model: EmployeeModel },
              { model: DriverModel },
            ],
          },
          {
            model: FaultModel,
          },
        ],
      });

      if (!workOrder) return res.sendStatus(404);

      res.status(200).json(workOrder);
    } catch (error) {
      next(error);
    }
  },

  // Create a new work order
  create: async (req, res, next) => {
    try {
      let {
        serviceRequestId = null,
        expertId = null,
        workType = null,
        faults = null,
      } = req.body;

      if (!faults)
        throw { errors: [{ path: "faults", message: "Faults is required" }] };

      if (!Array.isArray(faults))
        throw {
          errors: [{ path: "faults", message: "Faults must be type of array" }],
        };

      if (faults.length === 0)
        throw {
          errors: [
            { path: "faults", message: "Faults can't be an empty array" },
          ],
        };

      const faultsError = faults.some(
        (id) => !validator.isInt(id, { allow_leading_zeros: false, gt: 0 })
      );

      if (faultsError)
        throw {
          errors: [
            {
              path: "faults",
              message: "Faults must only contain fault ids",
            },
          ],
        };

      const result = await sequelize.transaction(async (t) => {
        const workOrder = await WorkOrderModel.create(
          {
            serviceRequestId,
            expertId,
            workType,
          },
          { transaction: t }
        );

        const workOrderServiceRequest = await workOrder.getServiceRequest();
        if (workOrderServiceRequest.status !== "accepted")
          throw {
            errors: [
              {
                path: "serviceRequestId",
                message: "Can't create a work order under this service request",
              },
            ],
          };

        let faultObjects = await Promise.all(
          faults.map(async (fault) => {
            const faultObject = await FaultModel.findOne(
              {
                where: {
                  [Op.and]: [
                    { id: fault },
                    {
                      serviceRequestId: workOrder.serviceRequestId,
                    },
                  ],
                },
              },
              { transaction: t }
            );
            return faultObject ? faultObject.id : null;
          })
        );

        faultObjects = faultObjects.filter((fault) => fault !== null);

        if (faultObjects.length !== faults.length)
          throw {
            errors: [
              {
                path: "faults",
                message: "Faults must be associated with the service request",
              },
            ],
          };

        await workOrder.setFaults(faultObjects, { transaction: t });

        return workOrder;
      });

      res.status(201).json(result.id);
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        if (error.parent.constraint === "work_order_service_request_id_fkey")
          return res.status(400).json({
            errors: [
              {
                path: "serviceRequestId",
                message: "Invalid Service Request Id",
              },
            ],
          });

        if (error.parent.constraint === "work_order_employee_id_fkey")
          return res.status(400).json({
            errors: [
              {
                path: "expertId",
                message: "Invalid Expert Id",
              },
            ],
          });

        next(error);
      }

      if (error.errors) {
        return res.status(400).json({
          errors: error.errors?.map((err) => {
            return { path: err.path, message: err.message };
          }),
        });
      }

      next(error);
    }
  },

  // Update work order
  update: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      let { expertId, workType } = req.body;

      const workOrder = await WorkOrderModel.findByPk(id);

      if (!workOrder) return res.sendStatus(404);

      if (workOrder.startDate !== null)
        throw { message: "Work order can't be updated" };

      await workOrder.update({
        expertId,
        workType,
      });

      res.status(201).json(workOrder.id);
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        if (error.parent.constraint === "work_order_employee_id_fkey")
          return res.status(400).json({
            errors: [
              {
                path: "expertId",
                message: "Invalid Expert Id",
              },
            ],
          });

        next(error);
      }

      if (error.errors) {
        return res.status(400).json({
          errors: error.errors?.map((err) => {
            return { path: err.path, message: err.message };
          }),
        });
      }

      next(error);
    }
  },

  // Add faults to work order
  addFaults: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { faults } = req.body;
      if (isNaN(id)) return next();

      if (!faults)
        throw { errors: [{ path: "faults", message: "Faults is required" }] };

      if (!Array.isArray(faults))
        throw {
          errors: [{ path: "faults", message: "Faults must be type of array" }],
        };

      if (faults.length === 0)
        throw {
          errors: [
            { path: "faults", message: "Faults can't be an empty array" },
          ],
        };

      let faultsError = faults.some((fault) => !_.isPlainObject(fault));

      if (faultsError)
        throw {
          errors: [
            {
              path: "faults",
              message: "Faults must only contain fault objects",
            },
          ],
        };

      faultsError = faults.some(
        (fault) => !fault.description || typeof fault.description !== "string"
      );

      if (faultsError)
        throw {
          errors: [
            {
              path: "faults",
              message:
                "Every fault object in faults array must have a description and description should be string",
            },
          ],
        };

      const workOrder = await WorkOrderModel.findByPk(id);

      if (!workOrder) return next();

      if (workOrder.startDate !== null)
        throw { message: "Couldn't add faults to this work order" };

      faults = faults.map((fault) => ({
        ...fault,
        type: "additional",
        workOrderId: workOrder.id,
      }));

      await FaultModel.bulkCreate([...faults], {
        validate: true,
      });

      res.status(201).json(workOrder.id);
    } catch (error) {
      if (error.name === "AggregateError")
        return res.status(400).json({
          errors: { message: "Description is required for all faults" },
        });

      if (error.errors) {
        return res.status(400).json({
          errors: error.errors?.map((err) => {
            return { path: err.path, message: err.message };
          }),
        });
      }
      next(error);
    }
  },

  // Delete work order
  delete: async (req, res, next) => {
    try {
      let { id } = req.params;
      if (isNaN(id)) return next();

      const workOrder = await WorkOrderModel.findByPk(id);

      if (!workOrder) return next();

      if (workOrder.startDate !== null)
        throw { message: "Work order can't be deleted" };

      await sequelize.transaction(async (t) => {
        await workOrder.setFaults([], { transaction: t });
        await workOrder.destroy({ transaction: t });
      });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },

  // mark work order as started
  start: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { startDate, serviceType } = req.body;

      if (!startDate)
        throw {
          errors: [
            {
              path: "startDate",
              message: "Start Date is required",
            },
          ],
        };

      if (!serviceType)
        throw {
          errors: [
            {
              path: "serviceType",
              message: "Service Type is required",
            },
          ],
        };

      if (isNaN(id)) return next();

      const workOrder = await WorkOrderModel.findByPk(id);

      if (!workOrder) return next();

      if (workOrder.endDate !== null)
        throw { message: "Can't Set or Update this Work Order Start Date" };

      await workOrder.update({ startDate, serviceType });

      res.status(201).json(workOrder.id);
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({
          errors: error.errors?.map((err) => {
            return { path: err.path, message: err.message };
          }),
        });
      }

      if (error.message)
        return res.status(400).json({ errors: [{ message: error.message }] });

      next(error);
    }
  },

  // mark work order as completed
  end: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { endDate, serviceCost } = req.body;

      if (!endDate)
        throw {
          errors: [
            {
              path: "endDate",
              message: "End Date is required",
            },
          ],
        };

      if (isNaN(id)) return next();

      const workOrder = await WorkOrderModel.findByPk(id);

      if (!workOrder) return next();

      if (workOrder.startDate === null)
        throw { message: "Work order either not started yet" };

      await workOrder.update({ endDate, serviceCost });

      res.status(201).json(workOrder.id);
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({
          errors: error.errors?.map((err) => {
            return { path: err.path, message: err.message };
          }),
        });
      }

      if (error.message)
        return res.status(400).json({ errors: [{ message: error.message }] });

      next(error);
    }
  },
};
