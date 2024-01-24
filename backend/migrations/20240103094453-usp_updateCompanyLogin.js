'use strict';
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const { database } = config;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const schemaName = database; // Replace with your schema name
		const procedureName = 'usp_updateCompanyLogin'; // Replace with your procedure name
		const [results] = await queryInterface.sequelize.query(
			`SELECT routine_name FROM information_schema.routines WHERE routine_schema = '${schemaName}' AND routine_name = '${procedureName}' AND routine_type = 'PROCEDURE'`,
			{ type: queryInterface.sequelize.QueryTypes.SELECT }
		);
		if (results == undefined || results.length === 0) {
			// Procedure doesn't exist in the specified schema, you can create it here
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
		} else {
			// Procedure already exists in the specified schema, handle it as needed
			console.log("exist")
		}
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
