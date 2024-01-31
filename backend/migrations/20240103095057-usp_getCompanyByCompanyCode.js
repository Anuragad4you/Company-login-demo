'use strict';
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const { database } = config;
const schemaConfig = require("../src/helpers/schemaConfig");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
        // const schema = schemaConfig.schemaGetter;
        await queryInterface.sequelize.query(`
			DROP PROCEDURE IF EXISTS usp_getCompanyByCompanyCode;
		`);
		const createProcedureSQL = `
			CREATE PROCEDURE usp_getCompanyByCompanyCode(
                IN companyCode VARCHAR(255)
            )
            BEGIN
				DECLARE cID INT;
                
				SELECT * FROM companyLogins AS c
                WHERE c.companyCode = companyCode;
                
                SET cID = (SELECT companyID FROM companyLogins as cl WHERE cl.companyCode = companyCode);
                
                SELECT * FROM dbConfigs AS db
                WHERE db.companyID = cID;
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
			DROP PROCEDURE IF EXISTS usp_getCompanyByCompanyCode;
		`);
	}
};
