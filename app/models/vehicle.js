"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ VehicleType, ServiceRequest }) {
      // define association here
      Vehicle.belongsTo(VehicleType, {
        foreignKey: "vehicleTypeId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        as: "vehicleType",
      });

      Vehicle.hasMany(ServiceRequest, {
        foreignKey: "vehicleId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Vehicle.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      plateNo: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notNull: {
            args: true,
            msg: "Plate number is required",
          },
          is: {
            args: /^[1-5]{1}-(A|B)?\d{5}-(AA|AM|AF|BG|DR|ET|GM|HR|OR|SD|SM|SP|TG)$/,
            msg: "Invalid Plate No format",
          },
        },
      },
      manufacturer: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            args: true,
            msg: "Manufacturer is required",
          },
        },
      },
      model: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            args: true,
            msg: "Model is required",
          },
        },
      },
      project: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      vehicleTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Vehicle type is required",
          },
        },
      },
      engineNo: {
        type: DataTypes.STRING,
      },
      engineCapacity: {
        type: DataTypes.INTEGER,
      },
      engineType: {
        type: DataTypes.STRING,
      },
      chassisNo: {
        type: DataTypes.STRING,
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
      modelName: "Vehicle",
    }
  );
  return Vehicle;
};
