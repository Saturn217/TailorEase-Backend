const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { aunthenticateToken } = require('../middleware/auth');



router.post("/company/register", authController.registerCompany)
router.post("/staff/register", authController.registerStaff)
router.post("/login", authController.login)


router.get('/me', aunthenticateToken, (req, res) => {
    res.json({
        message: 'You are logged in',
        user: req.user
    })
})




module.exports = router;
