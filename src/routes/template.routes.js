const express = require('express')
const { authenticateToken, requireRole } = require('../middleware/auth')
const router = express.Router()
const templateController = require("../controllers/templateController")


router.post("/", authenticateToken, requireRole("SUPER_ADMIN"), templateController.createTemplate)
router.get("/", authenticateToken, requireRole("SUPER_ADMIN"), templateController.getAllTemplates )
router.patch("/:templateId", authenticateToken, requireRole("SUPER_ADMIN"), templateController.updateTemplate )
router.delete("/:templateId", authenticateToken,requireRole("SUPER_ADMIN"), templateController.deleteTemplate )



module.exports = router