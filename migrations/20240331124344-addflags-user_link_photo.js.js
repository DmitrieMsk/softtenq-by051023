'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'user_links_photos',
      'association_flags',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
      );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'user_links_photo',
      'association_flags'
      );
  }
};
