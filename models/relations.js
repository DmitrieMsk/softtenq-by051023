'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Relations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Relations.init({
    Actor_User_ID: DataTypes.INTEGER,
    Target_User_ID: DataTypes.INTEGER,
    IsFriend: DataTypes.BOOLEAN,
    IsFollowing: DataTypes.BOOLEAN,
    IsPendingFriendRequest: DataTypes.BOOLEAN,
    IsBlocked: DataTypes.BOOLEAN,
    IsHiddenFriend: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Relations',
  });
  return Relations;
};