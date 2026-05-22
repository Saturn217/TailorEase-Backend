const express = require('express')
const { authenticateToken, requireRole } = require('../middleware/auth')
const orderController = require('../controllers/orderController')
const { uploadOrdersImage } = require('../utils/cloudinary')
const handleUpload = require('../middleware/uploadMiddleware')
const router = express.Router()

router.get("/", authenticateToken, requireRole("SUPER_ADMIN"), orderController.getCompanyOrders)
router.patch("/:orderId/status", authenticateToken, orderController.updateOrderStatus)
router.post("/:orderId/photos", authenticateToken, handleUpload(uploadOrdersImage.single("photo")), orderController.uploadOrderPhoto)



module.exports = router