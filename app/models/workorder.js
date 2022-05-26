"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WorkOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ServiceRequest, Employee, Fault }) {
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

          isBefore(value) {
            if (value > this.endDate)
              throw new Error("Start Date must be after Start Date");
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
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notNull: {
            args: true,
            msg: "Expert Id is required",
          },
          isInt: {
            args: true,
            msg: "Expert Id must be an integer",
          },
        },
      },
      workDepartment: {
        allowNull: false,
        type: DataTypes.ENUM("Mechanical", "Electrical", "Body"),
        validate: {
          notNull: {
            args: true,
            msg: "Work Type is required",
          },
          isIn: {
            args: [["Mechanical", "Electrical", "Body"]],
            msg: "Work Type must be one of the following: Mechanical, Electrical, Body",
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
      validate: {
        ServiceCost() {
          if (
            this.serviceType === "out-source" &&
            !this.serviceCost &&
            this.serviceCost !== 0
          )
            throw new Error("Service Cost is Required");
        },
      },
      modelName: "WorkOrder",
    }
  );
  return WorkOrder;
};
