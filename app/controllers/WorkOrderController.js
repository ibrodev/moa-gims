const WorkOrderModel = require("../models").WorkOrder;
const ServiceRequestModel = require("../models").ServiceRequest;
const EmployeeModel = require("../models").Employee;
const VehicleModel = require("../models").Vehicle;
const VehicleTypeModel = require("../models").VehicleType;
const DriverModel = require("../models").Driver;
const FaultModel = require("../models").Fault;
const SparePartModel = require("../models").SparePart;
const PerformedTaskModel = require("../models").PerformedTask;
const DepartmentModel = require("../models").Department;
const validator = require("validator");
const { sequelize } = require("../models");
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
          {
            model: SparePartModel,
          },
          {
            model: PerformedTaskModel,
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
              {
                model: VehicleModel,
                include: [{ model: VehicleTypeModel, as: "vehicleType" }],
              },
              { model: EmployeeModel },
              { model: DriverModel },
              {
                model: DepartmentModel,
              },
            ],
          },
          {
            model: FaultModel,
          },
          {
            model: SparePartModel,
          },
          {
            model: PerformedTaskModel,
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
        serviceRequestId,
        type,
        serviceType,
        workDepartment,
        expertId,
        maintenanceType,
        maintenanceLocation,
        crashAccident,
        insurance,
        faults,
      } = req.body;

      serviceRequestId =
        parseInt(validator.escape(validator.trim(serviceRequestId))) ||
        undefined;
      type = validator.escape(validator.trim(type)) || undefined;
      serviceType = validator.escape(validator.trim(serviceType)) || undefined;
      workDepartment =
        validator.escape(validator.trim(workDepartment)) || undefined;
      expertId =
        parseInt(validator.escape(validator.trim(expertId))) || undefined;
      maintenanceType =
        validator.escape(validator.trim(maintenanceType)) || undefined;
      maintenanceLocation =
        validator.escape(validator.trim(maintenanceLocation)) || undefined;

      const serviceRequest = await ServiceRequestModel.findByPk(
        serviceRequestId
      );
      if (!serviceRequest || serviceRequest.status !== "accepted")
        throw {
          errors: [
            { path: "serviceRequestId", message: "Invalid Service Request Id" },
          ],
        };

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
            type,
            serviceType,
            workDepartment,
            expertId,
            maintenanceType,
            maintenanceLocation,
            crashAccident,
            insurance,
          },
          { transaction: t }
        );

        const checkFaultIds = await serviceRequest.hasFaults(faults);
        if (!checkFaultIds)
          throw {
            errors: [
              { path: "faults", message: "One or more invalid Fault Ids" },
            ],
          };

        await workOrder.setFaults(faults, { transaction: t });

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
  // update: async (req, res, next) => {
  //   try {
  //     let { id } = req.params;
  //     if (isNaN(id)) return next();

  //     let { expertId, workType } = req.body;

  //     const workOrder = await WorkOrderModel.findByPk(id);

  //     if (!workOrder) return res.sendStatus(404);

  //     if (workOrder.startDate !== null)
  //       throw { message: "Work order can't be updated" };

  //     await workOrder.update({
  //       expertId,
  //       workType,
  //     });

  //     res.status(201).json(workOrder.id);
  //   } catch (error) {
  //     if (error.name === "SequelizeForeignKeyConstraintError") {
  //       if (error.parent.constraint === "work_order_employee_id_fkey")
  //         return res.status(400).json({
  //           errors: [
  //             {
  //               path: "expertId",
  //               message: "Invalid Expert Id",
  //             },
  //           ],
  //         });

  //       next(error);
  //     }

  //     if (error.errors) {
  //       return res.status(400).json({
  //         errors: error.errors?.map((err) => {
  //           return { path: err.path, message: err.message };
  //         }),
  //       });
  //     }

  //     next(error);
  //   }
  // },

  // Add faults to work order
  // addFaults: async (req, res, next) => {
  //   try {
  //     let { id } = req.params;
  //     let { faults } = req.body;
  //     if (isNaN(id)) return next();

  //     if (!faults)
  //       throw { errors: [{ path: "faults", message: "Faults is required" }] };

  //     if (!Array.isArray(faults))
  //       throw {
  //         errors: [{ path: "faults", message: "Faults must be type of array" }],
  //       };

  //     if (faults.length === 0)
  //       throw {
  //         errors: [
  //           { path: "faults", message: "Faults can't be an empty array" },
  //         ],
  //       };

  //     let faultsError = faults.some((fault) => !_.isPlainObject(fault));

  //     if (faultsError)
  //       throw {
  //         errors: [
  //           {
  //             path: "faults",
  //             message: "Faults must only contain fault objects",
  //           },
  //         ],
  //       };

  //     faultsError = faults.some(
  //       (fault) => !fault.description || typeof fault.description !== "string"
  //     );

  //     if (faultsError)
  //       throw {
  //         errors: [
  //           {
  //             path: "faults",
  //             message:
  //               "Every fault object in faults array must have a description and description should be string",
  //           },
  //         ],
  //       };

  //     const workOrder = await WorkOrderModel.findByPk(id);

  //     if (!workOrder) return next();

  //     if (workOrder.startDate !== null)
  //       throw { message: "Couldn't add faults to this work order" };

  //     faults = faults.map((fault) => ({
  //       ...fault,
  //       type: "additional",
  //       workOrderId: workOrder.id,
  //     }));

  //     await FaultModel.bulkCreate([...faults], {
  //       validate: true,
  //     });

  //     res.status(201).json(workOrder.id);
  //   } catch (error) {
  //     if (error.name === "AggregateError")
  //       return res.status(400).json({
  //         errors: { message: "Description is required for all faults" },
  //       });

  //     if (error.errors) {
  //       return res.status(400).json({
  //         errors: error.errors?.map((err) => {
  //           return { path: err.path, message: err.message };
  //         }),
  //       });
  //     }
  //     next(error);
  //   }
  // },

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
      let { startDate } = req.body;

      if (!startDate)
        throw {
          errors: [
            {
              path: "startDate",
              message: "Start Date is required",
            },
          ],
        };

      if (isNaN(id)) return next();

      const workOrder = await WorkOrderModel.findByPk(id);

      if (!workOrder) return next();

      if (workOrder.endDate !== null)
        throw { message: "Can't Set or Update this Work Order Start Date" };

      await workOrder.update({ startDate, status: "in-progress" });

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
      let { endDate } = req.body;

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
        throw { message: "Work order is not started yet" };

      await workOrder.update({ endDate, status: "completed" });

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

  // add spare parts to work order
  addParts: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { parts } = req.body;

      if (isNaN(id)) return next();

      if (
        !parts ||
        !Array.isArray(parts) ||
        parts.length === 0 ||
        parts.some((part) => !_.isPlainObject(part))
      )
        throw {
          message:
            "Spare Parts are required and must be an array of spare part objects",
        };

      const workOrder = await WorkOrderModel.findByPk(id);
      if (!workOrder) return next();

      if (workOrder.status !== "in-progress")
        throw { message: "Couldn't add Spare Parts to Work Order" };

      parts = parts.map((part) => ({
        workOrderId: workOrder.id,
        ...part,
      }));

      const newParts = await SparePartModel.bulkCreate(parts, {
        validate: true,
      });

      res.status(201).json(workOrder.id);
    } catch (error) {
      if (error.name === "AggregateError") {
        return res.status(400).json({
          errors: error.errors
            ?.map((err, i) =>
              err.errors.errors.map((err) => ({
                path: `parts.${i}.${err.path}`,
                message: err.message,
              }))
            )
            .flat(),
        });
      }

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

  // set work order as complete
  setComplete: async (req, res, next) => {
    try {
      let { id } = req.params;
      let { serviceCost, tasks } = req.body;

      if (isNaN(id)) return next();

      if (
        !tasks ||
        !Array.isArray(tasks) ||
        tasks.length === 0 ||
        tasks.some((part) => !_.isPlainObject(part))
      )
        throw {
          message:
            "Performed Tasks are required and must be an array of performed task objects",
        };

      const workOrder = await WorkOrderModel.findByPk(id);
      if (!workOrder) return next();

      if (workOrder.serviceType === "out-source" && !serviceCost)
        throw { path: "serviceCost", message: "Service Cost is required" };

      if (workOrder.status !== "in-progress")
        throw { message: "Couldn't complete Work Order" };

      tasks = tasks.map((task) => ({
        workOrderId: workOrder.id,
        ...task,
      }));

      const result = await sequelize.transaction(async (t) => {
        const newTasks = await PerformedTaskModel.bulkCreate(tasks, {
          validate: true,
          transaction: t,
        });

        await workOrder.update(
          { serviceCost, status: "completed", endDate: Date.now() },
          { transaction: t }
        );
        return true;
      });

      res.status(201).json(workOrder.id);
    } catch (error) {
      if (error.name === "AggregateError") {
        return res.status(400).json({
          errors: error.errors
            ?.map((err, i) =>
              err.errors.errors.map((err) => ({
                path: `parts.${i}.${err.path}`,
                message: err.message,
              }))
            )
            .flat(),
        });
      }

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

  // Count all work orders
  count: async (req, res, next) => {
    try {
      const count = await WorkOrderModel.count();
      res.status(200).json(count);
    } catch (error) {
      next(error);
    }
  },
};
