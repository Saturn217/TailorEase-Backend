const express = require('express')
const { authenticateToken, requireRole } = require('../middleware/auth')
const orderController = require('../controllers/orderController')
const router = express.Router()

router.get("/", authenticateToken, requireRole("SUPER_ADMIN"), orderController.getCompanyOrders)
router.patch("/:orderId/status", authenticateToken, orderController.updateOrderStatus)



module.exports = router