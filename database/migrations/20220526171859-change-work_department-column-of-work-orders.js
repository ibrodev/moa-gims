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
      await queryInterface.removeColumn("WorkOrders", "workDepartment", {
        transaction: t,
      }),
        await queryInterface.addColumn(
          "WorkOrders",
          "workDepartment",
          {
            type: Sequelize.ENUM("Mechanical", "Electrical", "Body"),
            allowNull: true,
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
      await queryInterface.removeColumn("WorkOrders", "workDepartment", {
        transaction: t,
      }),
        await queryInterface.addColumn(
          "WorkOrders",
          "workDepartment",
          {
            type: Sequelize.ENUM,
            values: ["Mechanical", "Electrical", "Body"],
            allowNull: false,
          },
          { transaction: t }
        );
    });
  },
};
