const { Sequelize } = require("sequelize");
const DbUtil = require("../../config/dbUtil");

const dbUtil = new DbUtil();

const dbChanger = (dbConfig) => {
  const sequelize = new Sequelize({
    dialect: "mysql",
    host: "127.0.0.1",
    username: dbConfig.userName,
    password: dbConfig.password,
    database: dbConfig.dbName,
  });

  dbUtil.dbConnecter(sequelize, dbConfig, false);
};

module.exports = dbChanger;
