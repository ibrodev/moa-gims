"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Fault extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ServiceRequest, WorkOrder }) {
      // define association here
      Fault.belongsTo(ServiceRequest, {
        foreignKey: "serviceRequestId",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
        constraints: false,
      });

      Fault.belongsTo(WorkOrder, {
        foreignKey: "workOrderId",
        onDelete: "RESTRICT",
        onUpdate: "NO ACTION",
        constraints: false,
      });
    }
  }
  Fault.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
        unique: "fault_unique",
        validate: {
          notNull: {
            args: true,
            msg: "Description is required",
          },
        },
      },
      serviceRequestId: {
        unique: "fault_unique",
        type: DataTypes.INTEGER,
      },
      workOrderId: {
        unique: "fault_unique",
        type: DataTypes.INTEGER,
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM("initial", "additional"),
        validate: {
          isIn: {
            args: [["initial", "additional"]],
            msg: "Type must be either initial or additional",
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
      modelName: "Fault",
    }
  );
  return Fault;
};
