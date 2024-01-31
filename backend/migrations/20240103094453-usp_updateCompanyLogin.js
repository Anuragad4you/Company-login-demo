'use strict';
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const { database } = config;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {

        await queryInterface.sequelize.query(`
			DROP PROCEDURE IF EXISTS usp_updateCompanyLogin;
		`);

		const createProcedureSQL = `
			CREATE PROCEDURE usp_updateCompanyLogin(
                IN companyID INT,
                IN companyName VARCHAR(255),
                IN companyCode VARCHAR(255),
                IN companyLogo VARCHAR(255),
                IN userName VARCHAR(255),
                IN password VARCHAR(255)
            )
            BEGIN
                DECLARE cID INT;
                
					-- Create a unique database name based on companyCode
					SET @dbName = CONCAT(companyCode, '_db');
                    
                    -- Insert into companyLogins
                    INSERT INTO companyLogins(companyName, companyCode, companyLogo)
                    VALUES(companyName, companyCode, companyLogo);
                    
                    SET cID = (SELECT LAST_INSERT_ID());
                    
                    INSERT INTO dbConfigs(companyID, dbName, userName, password)
                    VALUES(cID, @dbName, userName, password);
                    
                SELECT cID as companyID;
            END
		`;
			return await queryInterface.sequelize.query(createProcedureSQL);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		return queryInterface.sequelize.query(`
			DROP PROCEDURE IF EXISTS usp_updateCompanyLogin;
		`);
	}
};
