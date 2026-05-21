const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { aunthenticateToken } = require('../middleware/auth');
const { uploadCompanyImage } = require('../utils/cloudinary');



router.post("/company/register", uploadCompanyImage.single('companyImage'), authController.registerCompany)
router.post("/staff/register", authController.registerStaff)
router.post("/login", authController.login)


// router.get('/me', aunthenticateToken, (req, res) => {
//     res.json({
//         message: 'You are logged in',
//         user: req.user
//     })
// })




module.exports = router;
