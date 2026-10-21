const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', teamController.getAllTeam);
router.post('/', authenticateToken, teamController.createTeam);
router.put('/:id', authenticateToken, teamController.updateTeam);
router.delete('/:id', authenticateToken, teamController.deleteTeam);

module.exports = router;
