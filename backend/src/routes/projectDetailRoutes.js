/**
 * Project Detail Routes
 */

const express = require('express');
const router = express.Router();
const projectDetailController = require('../controllers/projectDetailController');
const authMiddleware = require('../middlewares/authMiddleware');

// ── PUBLIC ROUTES ──
// GET /api/project-details/:slug
router.get('/:slug', projectDetailController.getProjectDetail);

// ── PROTECTED ROUTES (Admin only) ──
// PUT /api/project-details/:projectId
router.put('/:projectId', authMiddleware, projectDetailController.updateProjectDetail);

module.exports = router;
