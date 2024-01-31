const { migrationProcess } = require("../models");
const { exec } = require("child_process");

const sequelizeAuthenticator = (sequelize, config,  isNewConnection) => {
    sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
        const db = migrationProcess(config, isNewConnection);
        db.sequelize
          .sync()
          .then(() => {
            console.log("Synced db.");
            // Logic for Sync all Migration scripts
            const migrationProcess = exec("npx sequelize-cli db:migrate");
            migrationProcess.stdout.on("data", (data) => {
              console.log(data);
            });
            migrationProcess.stderr.on("data", (data) => {
              console.error(data);
            });
            migrationProcess.on("close", (code) => {
              if (code === 0) {
                //sequelize.query(`USE ${database}`);
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
}

module.exports = sequelizeAuthenticator;