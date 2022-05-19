"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SparePart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ WorkOrder }) {
      // define association here
      SparePart.belongsTo(WorkOrder, {
        foreignKey: "workOrderId",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });
    }
  }
  SparePart.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      workOrderId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
        validate: {
          notNull: {
            args: true,
            msg: "Work Order Id is required",
          },
        },
      },
      partName: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: "unique_spare_part",
        validate: {
          notNull: {
            args: true,
            msg: "Part Name is required",
          },
          notEmpty: {
            args: true,
            msg: "Part Name can't be empty",
          },
        },
      },
      partNumber: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: "unique_spare_part",
        validate: {
          notNull: {
            args: true,
            msg: "Part Number is required",
          },
          notEmpty: {
            args: true,
            msg: "Part Number can't be empty",
          },
        },
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notNull: {
            args: true,
            msg: "Quantity is required",
          },
          min: {
            args: 1,
            msg: "Quantity must be greater than or equal to 1",
          },
        },
      },
      unitPrice: {
        allowNull: false,
        type: DataTypes.FLOAT,
        validate: {
          notNull: {
            args: true,
            msg: "Unit Price is required",
          },
          min: {
            args: 0.1,
            msg: "Unit Price must be greater than 0.1",
          },
        },
      },
      returned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      modelName: "SparePart",
    }
  );
  return SparePart;
};
