const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  getProjectDetailBySlug,
  getProjectDetailById,
  upsertProjectDetail
} = require('../controllers/projectDetailsController');

// GET project detail by ID for admin editing (PROTECTED) - harus didefinisikan duluan
router.get('/admin/:id', authenticateToken, getProjectDetailById);

// GET project detail by slug (PUBLIC)
router.get('/:slug', getProjectDetailBySlug);

// POST/PUT project detail (PROTECTED)
router.post('/:id', authenticateToken, upsertProjectDetail);
router.put('/:id', authenticateToken, upsertProjectDetail);

module.exports = router;
