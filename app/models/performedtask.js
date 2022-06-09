"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PerformedTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PerformedTask.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      workOrderId: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
        unique: false,
      },
      laborCost: {
        type: DataTypes.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "PerformedTask",
    }
  );
  return PerformedTask;
};
