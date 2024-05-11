const Sequelize = require("sequelize");
require('dotenv').config();
const config = process.env;
console.log(config.DB_PORT)

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.DIALECT,
    username: config.USER,
    password: config.PASSWORD,
    database: config.DB,
    port: config.DB_PORT,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.user_links_photo = require("../models/users_photos.js")(sequelize, Sequelize);
db.post = require("../models/posts.js")(sequelize, Sequelize);
db.like = require("../models/likes.js")(sequelize, Sequelize);
db.relation = require("../models/relations.js")(sequelize, Sequelize);
db.comment = require("../models/comments.js")(sequelize, Sequelize);
db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;