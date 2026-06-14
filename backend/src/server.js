require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const { redirectUrl } = require('./controllers/urlController');
const { getPublicStats } = require('./controllers/analyticsController');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Public Routes
app.get('/stats/:shortCode', getPublicStats);
app.get('/:shortCode', redirectUrl);

// Root Route
app.get('/', (req, res) => {
  res.send('ShrinkLQ Backend is Running 🚀');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  } else {
    throw err;
  }
});