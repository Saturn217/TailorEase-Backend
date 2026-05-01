const staffController = require('../controllers/staffController')
const { requireRole, authenticateToken } = require('../middleware/auth') 
const router = require('express').Router()



router.get("/", authenticateToken ,requireRole("SUPER_ADMIN"), staffController.getAllStaff)

router.patch("/:staffId/status", authenticateToken, requireRole("SUPER_ADMIN"), staffController.updateStaffStatus)





module.exports = router