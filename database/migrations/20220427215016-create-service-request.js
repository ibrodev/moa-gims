"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ServiceRequests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      vehicleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      departmentId: {
        type: Sequelize.INTEGER,
      },
      driverId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      odometerReading: {
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          "draft",
          "submitted",
          "pending-inspection",
          "accepted",
          "rejected",
          "cancelled"
        ),
        defaultValue: "draft",
      },
      inspectorId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("ServiceRequests");
  },
};
