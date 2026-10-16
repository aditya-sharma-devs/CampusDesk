const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { ensureSeeded } = require('./utils/autoSeed');

dotenv.config({ path: path.join(__dirname, '.env') });

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thapar_classroom_db';

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully.');
    await ensureSeeded();
  })
  .catch(err => {
    console.warn('⚠️ MongoDB connection warning:', err.message);
    console.warn('ℹ️ API will operate with in-memory sample dataset fallback if database remains unreachable.');
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  console.log(`🌐 Base API endpoint: http://localhost:${PORT}/api/health`);
});
