const express = require('express')
const { aunthenticateToken, requireRole } = require('../middleware/auth')
const router = express.Router()
const templateController = require("../controllers/templateController")


router.post("/", aunthenticateToken, requireRole("SUPER_ADMIN"), templateController.createTemplate)



module.exports = router