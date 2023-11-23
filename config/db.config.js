module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "dimaSql2023Asus",
    DB: "dbbydima10",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };