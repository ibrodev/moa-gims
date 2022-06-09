"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn("WorkOrders", "serviceType", {
        transaction: t,
      }),
        await queryInterface.dropEnum("enum_WorkOrders_serviceType", {
          transaction: t,
        }),
        await queryInterface.addColumn(
          "WorkOrders",
          "serviceType",
          {
            type: Sequelize.ENUM("in-house", "out-source"),
            allowNull: false,
          },
          { transaction: t }
        );
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn("WorkOrders", "serviceType", {
        transaction: t,
      }),
        await queryInterface.dropEnum("enum_WorkOrders_serviceType", {
          transaction: t,
        }),
        await queryInterface.addColumn(
          "WorkOrders",
          "serviceType",
          {
            type: Sequelize.ENUM("in-house", "out-source"),
            allowNull: true,
          },
          { transaction: t }
        );
    });
  },
};
