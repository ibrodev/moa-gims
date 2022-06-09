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
      await queryInterface.removeColumn("ServiceRequests", "status", {
        transaction: t,
      });

      await queryInterface.dropEnum("enum_ServiceRequests_status", {
        transaction: t,
      }),
        await queryInterface.addColumn(
          "ServiceRequests",
          "status",
          {
            type: Sequelize.ENUM(
              "draft",
              "submitted",
              "pending-inspection",
              "accepted",
              "rejected",
              "cancelled",
              "completed"
            ),
            allowNull: false,
            defaultValue: "draft",
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
      await queryInterface.removeColumn("ServiceRequests", "status", {
        transaction: t,
      });
      await queryInterface.dropEnum("enum_ServiceRequests_status", {
        transaction: t,
      }),
        await queryInterface.addColumn(
          "ServiceRequests",
          "status",
          {
            type: Sequelize.ENUM(
              "draft",
              "submitted",
              "pending-inspection",
              "accepted",
              "rejected",
              "cancelled"
            ),
            allowNull: false,
            defaultValue: "draft",
          },
          { transaction: t }
        );
    });
  },
};
