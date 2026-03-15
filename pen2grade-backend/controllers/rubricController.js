const Rubric = require('../models/Rubric');

// @desc    Create a new rubric
// @route   POST /api/rubrics
// @access  Private
exports.createRubric = async (req, res) => {
  try {
    const { title, criteria } = req.body;

    const rubric = new Rubric({
      teacher: req.user.id,
      title,
      criteria
    });

    const savedRubric = await rubric.save();
    res.status(201).json(savedRubric);
  } catch (error) {
    console.error('Create rubric error:', error);
    res.status(500).json({ message: 'Server error creating rubric' });
  }
};

// @desc    Get all rubrics for the logged-in teacher
// @route   GET /api/rubrics
// @access  Private
exports.getRubrics = async (req, res) => {
  try {
    const rubrics = await Rubric.find({ teacher: req.user.id }).sort({ createdAt: -1 });
    res.json(rubrics);
  } catch (error) {
    console.error('Fetch rubrics error:', error);
    res.status(500).json({ message: 'Server error fetching rubrics' });
  }
};

// @desc    Get a single rubric by ID
// @route   GET /api/rubrics/:id
// @access  Private
exports.getRubricById = async (req, res) => {
  try {
    const rubric = await Rubric.findById(req.params.id);
    
    if (!rubric) {
      return res.status(404).json({ message: 'Rubric not found' });
    }

    // Ensure the rubric belongs to the user
    if (rubric.teacher.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(rubric);
  } catch (error) {
    console.error('Fetch rubric error:', error);
    res.status(500).json({ message: 'Server error fetching rubric' });
  }
};

// @desc    Update a rubric
// @route   PUT /api/rubrics/:id
// @access  Private
exports.updateRubric = async (req, res) => {
  try {
    const { title, criteria } = req.body;
    let rubric = await Rubric.findById(req.params.id);

    if (!rubric) {
      return res.status(404).json({ message: 'Rubric not found' });
    }

    // Ensure the rubric belongs to the user
    if (rubric.teacher.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    rubric.title = title || rubric.title;
    rubric.criteria = criteria || rubric.criteria;

    const updatedRubric = await rubric.save();
    res.json(updatedRubric);
  } catch (error) {
    console.error('Update rubric error:', error);
    res.status(500).json({ message: 'Server error updating rubric' });
  }
};

// @desc    Delete a rubric
// @route   DELETE /api/rubrics/:id
// @access  Private
exports.deleteRubric = async (req, res) => {
  try {
    const rubric = await Rubric.findById(req.params.id);

    if (!rubric) {
      return res.status(404).json({ message: 'Rubric not found' });
    }

    // Ensure the rubric belongs to the user
    if (rubric.teacher.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Rubric.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rubric removed' });
  } catch (error) {
    console.error('Delete rubric error:', error);
    res.status(500).json({ message: 'Server error deleting rubric' });
  }
};
