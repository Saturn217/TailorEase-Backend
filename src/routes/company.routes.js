const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { uploadCompanyImage } = require('../utils/cloudinary');
const companyController = require('../controllers/companyController');
const handleUpload = require('../middleware/uploadMiddleware');
const router = express.Router();



router.patch("/profile", authenticateToken, requireRole("SUPER_ADMIN"),handleUpload(uploadCompanyImage.single('companyImage')), companyController.updateCompanyDetails)



module.exports = router;