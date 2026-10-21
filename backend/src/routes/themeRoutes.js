const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// GET Theme (Public)
router.get('/', themeController.getTheme);

// PUT Theme (Admin Only)
router.put('/', authenticateToken, themeController.updateTheme);

module.exports = router;
