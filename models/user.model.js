module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    profilePicture: {
      type: Sequelize.STRING
    },
    IsActive: {
      type: Sequelize.INTEGER
    }
  });

  return User;
};