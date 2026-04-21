const staffController = require('../controllers/staffController')
const { requireRole, aunthenticateToken } = require('../middleware/auth') 
const router = require('express').Router()



router.get("/:companyId", aunthenticateToken ,requireRole("SUPER_ADMIN"), staffController.getAllStaff)

router.patch("/:companyId/:staffId/status", aunthenticateToken, requireRole("SUPER_ADMIN"), staffController.updateStaffStatus)





module.exports = router