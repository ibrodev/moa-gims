"use strict";
const { Model } = require("sequelize");
const useBcrypt = require("sequelize-bcrypt");
const jwt = require("jsonwebtoken");
const { NoChangesDetected } = require("../helpers/errors");

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require("../../config/app");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Employee }) {
      User.belongsTo(Employee, {
        foreignKey: "employeeId",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    }

    toJSON() {
      const values = Object.assign({}, this.get());
      delete values.password;
      return values;
    }

    authenticateUser() {
      return {
        accessToken: this.generateToken({ id: this.id }, ACCESS_TOKEN_SECRET, {
          expiresIn: "15s",
        }),
        refreshToken: this.generateToken(
          { id: this.id },
          REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        ),
      };
    }

    generateToken(payload, secret, options = {}) {
      return jwt.sign(payload, secret, options);
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            args: true,
            msg: "username is required",
          },
          len: {
            args: [4, 20],
            msg: "username must be between 4 and 20 characters",
          },
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            args: true,
            msg: "password is required",
          },
        },
      },
      role: {
        allowNull: false,
        type: DataTypes.ENUM("admin", "team-leader", "inspector", "recorder"),
        validate: {
          isIn: {
            args: [["admin", "team-leader", "inspector", "recorder"]],
            msg: "role must be one of the following: admin, team-leader, inspector, recorder",
          },
          notNull: {
            args: true,
            msg: "role is required",
          },
        },
      },
      employeeId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  useBcrypt(User, { rounds: 10 });

  User.beforeUpdate(async (user, options) => {
    if (
      !user.changed("username") &&
      !user.changed("password") &&
      !user.changed("role") &&
      !user.changed("employeeId")
    ) {
      throw NoChangesDetected();
    }
  });

  return User;
};
