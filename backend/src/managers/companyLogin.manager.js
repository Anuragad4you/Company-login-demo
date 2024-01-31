const CompanyLoginData = require("../datalayers/companyLogin.data");
const dbChanger = require("../helpers/dbChanger");
const dbCreater = require("../helpers/dbCreater");
const schemaConfig = require("../helpers/schemaConfig");

const companyLoginData = new CompanyLoginData();

class CompanyLoginManager {
  /**
   * *Get Company By CompanyCode
   * @param {model} companyLogin.validators
   * @returns {object}
   */
  async getCompanyByCompanyCode(req) {
    try {
      const result = await companyLoginData.getCompanyByCompanyCode(req);
      let company = {};

      if (result && result.length > 0) {
        const module1 = result[0][0];
        const module2 = result[1][0];
        // Update  dbconfiguration
        schemaConfig.schemaSetter = module2.dbName;
        dbChanger(module2);
        company = {
          companyID: module1.companyID,
          companyName: module1.companyName,
          companyCode: module1.companyCode,
          companyLogo: module1.companyLogo,
        };
      }
      return company;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * *Update Company
   * @param {model} companyLogin.validators
   * @returns {Object}
   */
  async updateCompanyLogin(req) {
      try {
        // const dbConfig = {
        //     database: `${req.body.companyCode}_db`,
        //     username: 'root',
        //     password: 'Ssaha@11199',
        //     host: process.env.HOST,
        //     dialect: 'mysql'
        // }

        let uploadedImage = '';
        if(req.uploadedImage) {
            uploadedImage = req.uploadedImage;
            // console.log("first",uploadedImage);
        }
      const result = await companyLoginData.updateCompanyLogin(req, uploadedImage);

    // TODO: Calling dbCreating function
    // dbCreater(dbConfig);


      return result[0];
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = CompanyLoginManager;
