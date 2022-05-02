"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Faults", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      serviceRequestId: {
        type: Sequelize.INTEGER,
        unique: "fault_unique",
      },
      workOrderId: {
        type: Sequelize.INTEGER,
        unique: "fault_unique",
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
        unique: "failure_unique",
      },
      type: {
        type: Sequelize.ENUM("initial", "additional"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Faults");
  },
};
