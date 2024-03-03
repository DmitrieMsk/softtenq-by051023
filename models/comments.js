'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comments.init({
    //02.03 can either be commentId or postId 
    Topic_ID: DataTypes.INTEGER,
    Actor_ID: DataTypes.INTEGER,
    Text: DataTypes.STRING,
    IsReply: DataTypes.BOOLEAN,
    Publication_Date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};