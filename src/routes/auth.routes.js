const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



router.post("/company/register", authController.registerCompany )
router.post("/login", authController.login)



module.exports = router;
