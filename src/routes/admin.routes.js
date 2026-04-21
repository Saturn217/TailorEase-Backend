const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

const  isAppAdmin  = require('../middleware/isAppAdmin');



router.post("/login", adminController.adminLogin)

router.get("/companies", isAppAdmin, adminController.getAllCompanies)
router.patch("/companies/:companyId/status", isAppAdmin, adminController.updateCompanyStatus)

module.exports = router;
