const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public route: Kirim pesan kontak
router.post('/', contactController.submitContact);

// Admin routes:
router.get('/', authenticateToken, contactController.getAllContacts);
router.delete('/:id', authenticateToken, contactController.deleteContact);
router.patch('/:id/read', authenticateToken, contactController.markAsRead);

module.exports = router;
