'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Relations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Actor_User_ID: {
        type: Sequelize.INTEGER
      },
      Target_User_ID: {
        type: Sequelize.INTEGER
      },
      IsFriend: {
        type: Sequelize.BOOLEAN
      },
      IsFollowing: {
        type: Sequelize.BOOLEAN
      },
      IsPendingFriendRequest: {
        type: Sequelize.BOOLEAN
      },
      IsBlocked: {
        type: Sequelize.BOOLEAN
      },
      IsHiddenFriend: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Relations');
  }
};