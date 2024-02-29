'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Posts.init({
    Photo_ID: DataTypes.INTEGER,
    Owner_ID: DataTypes.INTEGER,
    Views: DataTypes.INTEGER,
    Tags: DataTypes.STRING,
    Publication_Date: DataTypes.DATE,
    Comment: DataTypes.STRING,
    Privacy: DataTypes.INTEGER,
    Reposted_From_ID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};