'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('notification_channel', 'error_counter', {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
    });
    await queryInterface.addColumn('notification_channel', 'last_error', {
        type: Sequelize.TEXT,
        allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('notification_channel', 'error_counter');
    await queryInterface.removeColumn('notification_channel', 'last_error');
  }
};
