"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addConstraint("SpareParts", {
      fields: ["workOrderId"],
      type: "foreign key",
      name: "spare_part_work_order_id_fkey",
      references: {
        table: "WorkOrders",
        field: "id",
      },
      onDelete: "cascade",
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
      "SpareParts",
      "spare_part_work_order_id_fkey"
    );
  },
};
