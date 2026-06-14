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

// ===== FIX FOR RAILWAY PROXY =====
app.set('trust proxy', 1);

// ===== CONNECT DATABASE =====
connectDB();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== API ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// ===== TEST ROUTE =====
app.get('/test', (req, res) => {
  res.send('TEST ROUTE WORKING');
});

// ===== PUBLIC ANALYTICS ROUTE =====
app.get('/stats/:shortCode', getPublicStats);

// ===== SHORT URL REDIRECT ROUTE =====
app.get('/:shortCode', redirectUrl);

// ===== ROOT ROUTE =====
app.get('/', (req, res) => {
  res.send('ShrinkLQ Backend is Running 🚀');
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ===== ERROR HANDLING =====
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  } else {
    throw err;
  }
});