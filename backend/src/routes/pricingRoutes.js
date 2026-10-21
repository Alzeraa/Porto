const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', pricingController.getAllPricing);
router.post('/', authenticateToken, pricingController.createPricing);
router.put('/:id', authenticateToken, pricingController.updatePricing);
router.delete('/:id', authenticateToken, pricingController.deletePricing);

module.exports = router;
