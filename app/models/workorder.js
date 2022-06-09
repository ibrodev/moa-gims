"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WorkOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      ServiceRequest,
      Employee,
      Fault,
      PerformedTask,
      SparePart,
    }) {
      // define association here
      WorkOrder.belongsTo(ServiceRequest, {
        foreignKey: "serviceRequestId",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });

      WorkOrder.belongsTo(Employee, {
        foreignKey: "expertId",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });

      WorkOrder.hasMany(Fault, {
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
        foreignKey: "workOrderId",
      });

      WorkOrder.hasMany(PerformedTask, {
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
        foreignKey: "workOrderId",
      });

      WorkOrder.hasMany(SparePart, {
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
        foreignKey: "workOrderId",
      });
    }
  }
  WorkOrder.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      serviceRequestId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notNull: {
            args: true,
            msg: "Service Request Id is required",
          },
          isInt: {
            args: true,
            msg: "Service Request Id must be an integer",
          },
        },
      },
      startDate: {
        type: DataTypes.DATE,
        validate: {
          isDate: {
            args: true,
            msg: "Start Date must be a valid date format",
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        validate: {
          isDate: {
            args: true,
            msg: "End Date must be a valid date format",
          },
          isAfter(value) {
            if (value < this.startDate)
              throw new Error("End Date must be after Start Date");
          },
        },
      },
      expertId: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            args: true,
            msg: "Expert Id must be an integer",
          },
        },
      },
      workDepartment: {
        type: DataTypes.ENUM("Mechanical", "Electrical", "Body"),
        validate: {
          isIn: {
            args: [["Mechanical", "Electrical", "Body"]],
            msg: "Work Department must be one of the following: Mechanical, Electrical, Body",
          },
        },
      },
      serviceType: {
        type: DataTypes.ENUM("in-house", "out-source"),
        validate: {
          isIn: {
            args: [["in-house", "out-source"]],
            msg: "Service Type must be either 'in-house' or 'out-source'",
          },
        },
      },

      type: {
        type: DataTypes.ENUM("regular", "project"),
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Type is required",
          },
          isIn: {
            args: [["regular", "project"]],
            msg: "Type must be either 'regular' or 'project'",
          },
        },
      },
      maintenanceType: {
        type: DataTypes.ENUM("preventive", "corrective"),
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Maintenance Type is required",
          },
          isIn: {
            args: [["preventive", "corrective"]],
            msg: "Maintenance Type must be either 'preventive' or 'corrective'",
          },
        },
      },
      maintenanceLocation: {
        type: DataTypes.ENUM("in-garage", "on-field", "on-road"),
        validate: {
          isIn: {
            args: [["in-garage", "on-field", "on-road"]],
            msg: "Maintenance Location must be one of the following: in-garage, on-field, on-road",
          },
        },
      },
      crashAccident: {
        type: DataTypes.BOOLEAN,
      },
      insurance: {
        type: DataTypes.BOOLEAN,
      },
      status: {
        type: DataTypes.ENUM("pending", "in-progress", "completed"),
        defaultValue: "pending",
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Status is required",
          },
          isIn: {
            args: [["pending", "in-progress", "completed"]],
            msg: "Status must be one of the following: pending, in-progress or completed",
          },
        },
      },
      serviceCost: {
        type: DataTypes.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,

      modelName: "WorkOrder",
    }
  );
  return WorkOrder;
};
