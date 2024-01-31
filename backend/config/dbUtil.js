const Sequelize = require("sequelize");
const sequelizeAuthenticator = require("./sequelizeAuthenticator");

class DbUtil {
  dbConnecter(sequelize, config, isNewConnection) {

    sequelizeAuthenticator(sequelize, config, isNewConnection);
  }

  dbCreater(sql, config, isNewConnection) {
    let sequelize = sql;
    sequelize
      .query(`CREATE DATABASE IF NOT EXISTS ${config.database}`)
      .then(() => {
        console.log("Database created successfully");
      })
      .then(() => {
        // After creating the database, switch to using it for Sequelize operations
        return sequelize.query(`USE ${config.database}`);
      })
      .catch((err) => {
        console.error("Error creating the database:", err);
      })
      .finally(() => {
        const database = config.database;
        const username = config.username;
        const password = config.password;
        sequelize = new Sequelize(database, username, password, {
          host: "127.0.0.1",
          dialect: "mysql",
        });

        sequelizeAuthenticator(sequelize, config, isNewConnection);
      });
  }
}

module.exports = DbUtil;
