/**
 * File this containts all the Models related to Database.
 * This used to generate the Tables in the Database.
 * This is the main file to generate tables automatically in the Database.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const {dbGetter} = require("../src/helpers/dbConfig");

const dbConfig = {
    database: dbGetter.database || config.database,
    username: dbGetter.userName || config.username,
    password: dbGetter.password || config.password,
    host: dbGetter.host || config.host,
    dialect: dbGetter.dialect || config.dialect
}
console.log(dbConfig);
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
        host: dbConfig.host,
        dialect: dbConfig.dialect
    });
}

// Logic for Read files from th modules directory
fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js" &&
            file.indexOf(".test.js") === -1
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
