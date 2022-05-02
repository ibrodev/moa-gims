"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint("ServiceRequests", {
      fields: ["vehicleId"],
      type: "foreign key",
      name: "service_request_vehicle_id_fkey",
      references: {
        table: "Vehicles",
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
      "ServiceRequests",
      "service_request_vehicle_id_fkey"
    );
  },
};
