const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Route imports
const authRoutes = require('./routes/authRoutes');
const rubricRoutes = require('./routes/rubricRoutes');
const essayRoutes = require('./routes/essayRoutes');
const Essay = require('./models/Essay');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { dbName: 'pen2grade' })
  .then(() => console.log('Connected to MongoDB Atlas (pen2grade DB)'))
  .catch(err => console.error('MongoDB connection error:', err));

// Public Stats — no auth required (landing page)
app.get('/api/stats', async (req, res) => {
  try {
    const gradedCount = await Essay.countDocuments({
      $or: [
        { status: 'completed' },
        { aiFeedback: { $exists: true, $ne: null } }
      ]
    });
    res.json({ gradedEssays: gradedCount });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ gradedEssays: 0 });
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/rubrics', rubricRoutes);
app.use('/api/essays', essayRoutes);

app.get('/', (req, res) => {
  res.send('Backend API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
