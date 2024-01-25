const Sequelize = require("sequelize");
const { exec } = require("child_process");

const dbCreater = (dbConfig) => {

  let sequelize = new Sequelize({
    username: dbConfig.userName,
    password: dbConfig.password,
    host: dbConfig.host,
    dialect: 'mysql',
  });

  //Logic for Create New Database if Not exist
  sequelize
    .query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`)
    .then(() => {
      console.log("Database created successfully");
    })
    .then(() => {
      // After creating the database, switch to using it for Sequelize operations
      return sequelize.query(`USE ${dbConfig.database}`);
    })
    .catch((err) => {
      console.error("Error creating the database:", err);
    })
    .finally(() => {
        const database = dbConfig.database;
        const username = dbConfig.userName;
        const password = dbConfig.password;
        sequelize = new Sequelize(database, username, password, {
            host: "127.0.0.1",
            dialect: "mysql"
        });
      sequelize
        .authenticate()
        .then(() => {
          console.log("Connection has been established successfully.");
          const db = require("../../models");
          db.sequelize
            .sync()
            .then(() => {
              console.log("Synced db.");
              const migrationProcess = exec("npx sequelize-cli db:migrate");

              // Logic for Sync all Migration scripts
              migrationProcess.stdout.on("data", (data) => {
                console.log(data);
              });
              migrationProcess.stderr.on("data", (data) => {
                console.error(data);
              });
              migrationProcess.on("close", (code) => {
                if (code === 0) {
                  console.log("Migrations executed successfully.");
                } else {
                  console.error("Migrations failed with exit code " + code);
                }
              });
            })
            .catch((err) => {
              console.log("Failed to sync db: " + err.message);
            });
        })
        .catch((error) => {
          console.error("Unable to connect to the database: ", error);
        });
    });
};

module.exports = dbCreater;
