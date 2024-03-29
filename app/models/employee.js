"use strict";
const { Model } = require("sequelize");
const { NoChangesDetected } = require("../helpers/errors");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Position }) {
      Employee.belongsTo(Position, {
        foreignKey: "positionId",
        onDelete: "CASCADE",
      });
    }
  }
  Employee.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: {
            args: true,
            msg: "First Name must only contain alphabet letters",
          },
          notNull: {
            args: true,
            msg: "First Name is required",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: {
            args: true,
            msg: "Last Name must only contain alphabet letters",
          },
          notNull: {
            args: true,
            msg: "Last Name is required",
          },
        },
      },
      positionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "position is required",
          },
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Employee",
    }
  );

  Employee.beforeUpdate(async (employee) => {
    if (
      !employee.changed("firstName") &&
      !employee.changed("lastName") &&
      !employee.changed("positionId")
    ) {
      throw NoChangesDetected();
    }
  });

  return Employee;
};
