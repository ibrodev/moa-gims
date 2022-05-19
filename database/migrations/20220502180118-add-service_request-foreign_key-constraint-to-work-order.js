"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint("WorkOrders", {
      fields: ["serviceRequestId"],
      type: "foreign key",
      name: "work_order_service_request_id_fkey",
      references: {
        table: "ServiceRequests",
        field: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint(
      "WorkOrders",
      "work_order_service_request_id_fkey"
    );
  },
};
