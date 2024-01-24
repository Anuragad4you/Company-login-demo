const { Router } = require("express");
const logoUpload = require("../middlewares/upload");
const CompanyLoginController = require("../controllers/companyLogin.controller");
const companyLoginController = new CompanyLoginController();
const router = Router();

router.post(
    "/createCompanyLogin",
    logoUpload.upload,
    (req, res, next) => {
        // File handling middleware
        if (!req.file) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }

        const uploadedImage = logoUpload.handleImageFile(req.file, req);
        req.uploadedImage = uploadedImage; // Attach uploadedImage to req
        next();
    },
    companyLoginController.updateCompanyLogin
);
router.post("/getCompanyLoginByCompanyCode", companyLoginController.getCompanyByCompanyCode);
    
module.exports = router;
