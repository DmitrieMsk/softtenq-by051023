module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "postgreSQLdima",
    DB: "dbbydima10",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };