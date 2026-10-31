const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', faqController.getAllFAQ);
router.post('/', authenticateToken, faqController.createFAQ);
router.put('/:id', authenticateToken, faqController.updateFAQ);
router.delete('/:id', authenticateToken, faqController.deleteFAQ);

module.exports = router;
