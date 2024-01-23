const {Sequelize} = require("sequelize");
const { exec } = require("child_process");

const dbChanger = (dbConfig) => {
    
    const sequelize = new Sequelize({
        dialect: 'mysql',
        host: '127.0.0.1',
        username: dbConfig.userName,
        password: dbConfig.password,
        database: dbConfig.dbName,
        connectionLimit: 10,
    });
    
    sequelize
    .authenticate()
    .then(() => {
        console.log(`Connected to the ${dbConfig.dbName}!`);
        const db = require("../../models");
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
        .catch((newError) => {
            console.error('Error connecting to the new database:', newError);
        })
    }

module.exports = dbChanger;