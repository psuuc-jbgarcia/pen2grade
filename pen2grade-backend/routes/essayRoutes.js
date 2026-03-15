const express = require('express');
const router = express.Router();
const essayController = require('../controllers/essayController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .post(protect, upload.single('document'), essayController.uploadEssay)
  .get(protect, essayController.getEssays);

router.route('/:id')
  .get(protect, essayController.getEssayById);

module.exports = router;
