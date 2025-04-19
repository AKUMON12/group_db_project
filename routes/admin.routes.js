// backend/routes/admin.routes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Admin login
router.post('/login', adminController.loginAdmin);

// Optional: Register a new admin
router.post('/register', adminController.registerAdmin);

module.exports = router;
