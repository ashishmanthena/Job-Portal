require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

console.log('[INFO] Starting server...');
console.log('[INFO] MONGO_URI configured:', !!process.env.MONGO_URI);
console.log('[INFO] PORT:', process.env.PORT);

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const appRoutes = require('./routes/applications');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded resumes (dev)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect MongoDB
console.log('[INFO] Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('[SUCCESS] MongoDB connected');
  })
  .catch(err => {
    console.error('[ERROR] MongoDB connection error:', err.message);
    console.error('[WARNING] Proceeding without MongoDB connection');
    // Don't exit - let server continue without DB
  });

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', appRoutes);

app.get('/', (req,res) => res.send('Job Portal API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[SUCCESS] Server started on port ${PORT}`));
