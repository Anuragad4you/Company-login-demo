const Sequelize = require("sequelize");
const { exec } = require("child_process");
const {migrationProcess} = require("../../models")
const DbUtil = require("../../config/dbUtil");

const dbUtil = new DbUtil();

const dbCreater = (dbConfig) => {

  let sequelize = new Sequelize({
    username: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.host,
    dialect: 'mysql',
  });

  dbUtil.dbCreater(sequelize, dbConfig, true);
};

module.exports = dbCreater;
