const db = require("../../config/database.js");

/**
 * CompanyLogin Data
 */
class CompanyLoginData {
  /**
   * *Get Company By CompanyCode
   * @param {model} companyLogin.validators
   * @returns {object}
   */
  async getCompanyByCompanyCode(req) {
    try {
      const companyCode = req.body.companyCode;
      const procedure = "usp_getCompanyByCompanyCode";

      const result = await db.query(`CALL ${procedure}(:companyCode)`, {
        replacements: { companyCode },
        type: db.QueryTypes.SELECT,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * *Update Company
   * @param {model} companyLogin.validators
   * @returns {Object}
   */
  async updateCompanyLogin(req, uploadedImage) {
    const { companyID, companyName, companyCode, actionType, userName, password } = req.body;
    const procedure = "usp_updateCompanyLogin";

    try {
        // Extract the filePath property from the uploadedImage object
        const filePath = uploadedImage ? uploadedImage.filePath : null;

        const result = await db.query(
            `CALL ${procedure}(:companyID, :companyName, :companyCode, :companyLogo, :userName, :password)`,
            {
                replacements: {
                    companyID,
                    companyName,
                    companyCode,
                    companyLogo: filePath, // Pass the file path instead of the entire object
                    actionType,
                    userName,
                    password
                },
                type: db.QueryTypes.RAW,
            }
        );
        return result;
    } catch (error) {
        throw error;
    }
}

}

module.exports = CompanyLoginData;
