// backend/routes/admin.routes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken } = require('../middleware/auth.middleware');
// Admin login
router.post('/login', adminController.loginAdmin);

// Optional: Register a new admin
router.post('/register', adminController.registerAdmin);


// 👇 NEW: Get all admins (protected route)
router.get('/', verifyToken, adminController.getAllAdmins);

module.exports = router;
