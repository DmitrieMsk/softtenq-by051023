const config = {
    development: {
        username: "postgres",
        password: "dimapgpass20232024",
        database: "database_development",
        host: "localhost",
        dialect: "postgres"
      }
}


const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('postgres:postgres:dimapgpass20232024:5432/testdbname')
module.exports = config;