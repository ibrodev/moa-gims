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
      await queryInterface.removeColumn("WorkOrders", "type", {
        transaction: t,
      }),
        await queryInterface.dropEnum("enum_WorkOrders_type", {
          transaction: t,
        }),
        await queryInterface.addColumn(
          "WorkOrders",
          "type",
          {
            type: Sequelize.ENUM("regular", "project"),
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
      await queryInterface.removeColumn("WorkOrders", "type", {
        transaction: t,
      }),
        await queryInterface.dropEnum("enum_WorkOrders_type", {
          transaction: t,
        }),
        await queryInterface.addColumn(
          "WorkOrders",
          "type",
          {
            type: Sequelize.ENUM("regular", "project"),
            allowNull: true,
          },
          { transaction: t }
        );
    });
  },
};
