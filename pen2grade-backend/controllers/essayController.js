const Essay = require('../models/Essay');
const Rubric = require('../models/Rubric');
const User = require('../models/User');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.uploadEssay = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { rubricId, studentName } = req.body;

    if (!rubricId || !studentName) {
      return res.status(400).json({ message: 'Rubric ID and student name are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date().toDateString();
    if (!user.lastAiCheckDate || user.lastAiCheckDate.toDateString() !== today) {
      user.aiCheckCount = 0;
      user.lastAiCheckDate = new Date();
    }

    if (user.aiCheckCount >= 10) {
      return res.status(403).json({ message: 'Daily limit reached. The free version allows 10 uses per day.' });
    }

    // Camera Scan Rate Limit Logic
    const isCameraScan = req.body.isCameraScan === 'true' || req.body.isCameraScan === true;
    if (isCameraScan) {
      if (!user.lastCameraScanDate || user.lastCameraScanDate.toDateString() !== today) {
        user.cameraScanCount = 0;
        user.lastCameraScanDate = new Date();
      }
      
      if (user.cameraScanCount >= 3) {
        return res.status(403).json({ message: 'Daily limit reached. The free version allows 3 camera scans per day.' });
      }
    }

    // Determine file type
    let fileType = 'unknown';
    if (req.file.mimetype.startsWith('image/')) fileType = 'image';
    else if (req.file.mimetype === 'application/pdf') fileType = 'pdf';
    else if (req.file.mimetype === 'text/plain') fileType = 'text';

    // Save initial essay record
    const newEssay = new Essay({
      teacher: req.user.id,
      rubric: rubricId,
      studentName,
      originalFilename: req.file.originalname,
      fileUrl: req.file.path,
      fileType,
      status: 'processing'
    });

    const savedEssay = await newEssay.save();

    user.aiCheckCount += 1;
    if (isCameraScan) {
      user.cameraScanCount += 1;
    }
    await user.save();

    res.status(201).json({
      message: 'Essay uploaded successfully. AI processing has begun.',
      essay: savedEssay
    });

    // --- Fire and forget async AI processing ---
    processEssay(savedEssay._id, req.file.path, fileType, rubricId).catch(err => {
      console.error('Async AI Processing Error:', err);
    });

  } catch (error) {
    console.error('Upload essay error:', error);
    res.status(500).json({ message: error.message || 'Server error uploading essay' });
  }
};

async function processEssay(essayId, filePath, fileType, rubricId) {
  try {
    let extractedText = "";

    // 1. Run OCR if it's an image
    if (fileType === 'image') {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      
      const ocrResponse = await axios.post(`${AI_SERVICE_URL}/api/ocr`, form, {
        headers: { ...form.getHeaders() }
      });
      extractedText = ocrResponse.data.extracted_text;
    } else if (fileType === 'text') {
      extractedText = fs.readFileSync(filePath, 'utf-8');
    }

    // 2. Fetch the Rubric
    const rubric = await Rubric.findById(rubricId);
    if (!rubric) throw new Error('Rubric not found');

    // 3. Evaluate essay against rubric
    const evalData = {
      text: extractedText,
      rubric_title: rubric.title,
      criteria: rubric.criteria.map(c => ({
        name: c.name,
        weight: c.weight,
        description: c.description || ""
      }))
    };

    const evalResponse = await axios.post(`${AI_SERVICE_URL}/api/evaluate`, evalData);
    const feedback = evalResponse.data;

    // 4. Update the Essay record
    await Essay.findByIdAndUpdate(essayId, {
      status: 'completed',
      extractedText,
      aiFeedback: feedback,
      totalScore: feedback.total_score
    });

  } catch (error) {
    console.error(`Failed to process essay ${essayId}:`, error.message);
    await Essay.findByIdAndUpdate(essayId, { status: 'failed' });
  }
}

exports.getEssays = async (req, res) => {
  try {
    const essays = await Essay.find({ teacher: req.user.id })
      .populate('rubric', 'title')
      .sort({ createdAt: -1 });
    res.json(essays);
  } catch (error) {
    console.error('Fetch essays error:', error);
    res.status(500).json({ message: 'Server error fetching essays' });
  }
};

exports.getEssayById = async (req, res) => {
  try {
    const essay = await Essay.findById(req.params.id)
      .populate('rubric');
    
    if (!essay) {
      return res.status(404).json({ message: 'Essay not found' });
    }

    if (essay.teacher.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(essay);
  } catch (error) {
    console.error('Fetch essay error:', error);
    res.status(500).json({ message: 'Server error fetching essay' });
  }
};

exports.updateEssay = async (req, res) => {
  try {
    const { totalScore, aiFeedbackBreakdown } = req.body;
    const essay = await Essay.findById(req.params.id);

    if (!essay) {
      return res.status(404).json({ message: 'Essay not found' });
    }

    if (!req.user || !req.user._id) {
       return res.status(401).json({ message: 'Authentication required' });
    }

    // Convert both to string for reliable comparison
    if (essay.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this essay' });
    }

    if (totalScore !== undefined) {
      essay.totalScore = totalScore;
    }

    if (aiFeedbackBreakdown !== undefined) {
      // Ensure aiFeedback and breakdown exist
      if (!essay.aiFeedback) essay.aiFeedback = {};
      if (!essay.aiFeedback.breakdown) essay.aiFeedback.breakdown = {};

      // Merge breakdown update to preserve max and feedback
      const newBreakdown = { ...essay.aiFeedback.breakdown };
      Object.entries(aiFeedbackBreakdown).forEach(([name, data]) => {
        if (newBreakdown[name]) {
          newBreakdown[name] = {
            ...newBreakdown[name],
            score: data.score
          };
        } else {
          newBreakdown[name] = data;
        }
      });
      
      essay.aiFeedback = {
        ...essay.aiFeedback,
        breakdown: newBreakdown
      };
      
      essay.markModified('aiFeedback');
    }

    const updatedEssay = await essay.save();
    res.json(updatedEssay);
  } catch (error) {
    console.error('Update essay error:', error);
    res.status(500).json({ message: error.message || 'Server error updating essay' });
  }
};
