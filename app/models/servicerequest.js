"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ServiceRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Vehicle,
      Department,
      Driver,
      Employee,
      Fault,
      WorkOrder,
    }) {
      // define association here
      ServiceRequest.belongsTo(Vehicle, {
        foreignKey: "vehicleId",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });

      ServiceRequest.belongsTo(Department, {
        foreignKey: "departmentId",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });

      ServiceRequest.belongsTo(Driver, {
        foreignKey: "driverId",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });

      ServiceRequest.belongsTo(Employee, {
        foreignKey: "inspectorId",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });

      ServiceRequest.hasMany(Fault, {
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
        foreignKey: "serviceRequestId",
        as: "faults",
      });

      ServiceRequest.hasMany(WorkOrder, {
        foreignKey: "serviceRequestId",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });
    }
  }
  ServiceRequest.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      vehicleId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notNull: {
            args: true,
            msg: "Vehicle Plate No is required",
          },
        },
      },
      departmentId: {
        type: DataTypes.INTEGER,
      },
      driverId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notNull: {
            args: true,
            msg: "Driver is required",
          },
        },
      },
      odometerReading: {
        type: DataTypes.INTEGER,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM(
          "draft",
          "submitted",
          "pending-inspection",
          "accepted",
          "rejected",
          "cancelled"
        ),
        defaultValue: "draft",
        validate: {
          isIn: {
            args: [
              [
                "draft",
                "submitted",
                "pending-inspection",
                "accepted",
                "rejected",
                "cancelled",
                "completed",
              ],
            ],
            msg: "status must be one of the following: draft, submitted, pending-inspection, accepted, rejected, cancelled",
          },
          notNull: {
            args: true,
            msg: "status is required",
          },
        },
      },
      inspectorId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      completedAt: {
        allowNull: true,
        type: DataTypes.DATE,
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
      modelName: "ServiceRequest",
    }
  );
  return ServiceRequest;
};
