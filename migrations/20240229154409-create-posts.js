'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Photo_ID: {
        type: Sequelize.INTEGER
      },
      Owner_ID: {
        type: Sequelize.INTEGER
      },
      Views: {
        type: Sequelize.INTEGER
      },
      Tags: {
        type: Sequelize.STRING
      },
      Publication_Date: {
        type: Sequelize.DATE
      },
      Comment: {
        type: Sequelize.STRING
      },
      Privacy: {
        type: Sequelize.INTEGER
      },
      Reposted_From_ID: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};