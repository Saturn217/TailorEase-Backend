const express = require('express')
const { authenticateToken, requireRole } = require('../middleware/auth')
const orderController = require('../controllers/orderController')
const router = express.Router()

router.get("/", authenticateToken, requireRole("SUPER_ADMIN"), orderController.getCompanyOrders)



module.exports = router