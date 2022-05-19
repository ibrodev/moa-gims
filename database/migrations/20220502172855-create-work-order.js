"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("WorkOrders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      serviceRequestId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      startDate: {
        type: Sequelize.DATE,
      },
      endDate: {
        type: Sequelize.DATE,
      },
      expertId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      workType: {
        allowNull: false,
        type: Sequelize.ENUM("Mechanical", "Electrical", "Body"),
      },
      serviceType: {
        type: Sequelize.ENUM("in-house", "out-source"),
      },
      serviceCost: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("WorkOrders");
  },
};
