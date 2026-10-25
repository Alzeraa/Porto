const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  getAllHeroCards,
  getHeroCardById,
  createHeroCard,
  updateHeroCard,
  deleteHeroCard,
  reorderHeroCards
} = require('../controllers/heroCardsController');

// Public routes
router.get('/', getAllHeroCards);
router.get('/:id', getHeroCardById);

// Protected routes (require authentication)
router.post('/', authenticateToken, createHeroCard);
router.put('/:id', authenticateToken, updateHeroCard);
router.delete('/:id', authenticateToken, deleteHeroCard);
router.put('/reorder/all', authenticateToken, reorderHeroCards);

module.exports = router;
