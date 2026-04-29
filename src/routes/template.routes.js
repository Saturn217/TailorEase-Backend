const express = require('express')
const { aunthenticateToken, requireRole } = require('../middleware/auth')
const router = express.Router()
const templateController = require("../controllers/templateController")


router.post("/", aunthenticateToken, requireRole("SUPER_ADMIN"), templateController.createTemplate)
router.get("/", aunthenticateToken, requireRole("SUPER_ADMIN"), templateController.getAllTemplates )
router.patch("/:templateId", aunthenticateToken, templateController.updateTemplate )



module.exports = router