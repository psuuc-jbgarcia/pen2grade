const express = require('express');
const router = express.Router();
const rubricController = require('../controllers/rubricController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, rubricController.createRubric)
  .get(protect, rubricController.getRubrics);

router.route('/:id')
  .get(protect, rubricController.getRubricById)
  .put(protect, rubricController.updateRubric)
  .delete(protect, rubricController.deleteRubric);

module.exports = router;
