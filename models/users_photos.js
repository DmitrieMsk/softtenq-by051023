'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_links_photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_links_photo.init({
    user_id: DataTypes.INTEGER,
    googledrive_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user_links_photo',
  });
  return user_links_photo;
};