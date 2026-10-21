const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', projectsController.getAllProjects);
router.post('/', authenticateToken, projectsController.createProject);
router.put('/:id', authenticateToken, projectsController.updateProject);
router.delete('/:id', authenticateToken, projectsController.deleteProject);

module.exports = router;
