const express = require('express');
const router = express.Router();
const aboutSectionsController = require('../controllers/aboutSectionsController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', aboutSectionsController.getAllAboutSections);
router.post('/', authenticateToken, aboutSectionsController.createAboutSection);
router.put('/:id', authenticateToken, aboutSectionsController.updateAboutSection);
router.delete('/:id', authenticateToken, aboutSectionsController.deleteAboutSection);

module.exports = router;
