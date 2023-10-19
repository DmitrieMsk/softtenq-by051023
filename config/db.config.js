module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "pgpgadmindima2324server",
    DB: "dbbydima10",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };