const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', testimonialsController.getAllTestimonials);
router.post('/', authenticateToken, testimonialsController.createTestimonial);
router.put('/:id', authenticateToken, testimonialsController.updateTestimonial);
router.delete('/:id', authenticateToken, testimonialsController.deleteTestimonial);

module.exports = router;
