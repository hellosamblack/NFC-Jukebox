require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const spotifyRoutes = require('./routes/spotify');
const youtubeRoutes = require('./routes/youtube');
const exportRoutes = require('./routes/export');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));

// Body parsing with 50MB limit for image data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static exports
app.use('/exports', express.static(path.join(__dirname, 'exports')));

// Routes
app.use('/api/spotify', spotifyRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`NFC-Jukebox server running on port ${PORT}`);
  if (!process.env.SPOTIFY_CLIENT_ID) {
    console.log('Note: No SPOTIFY_CLIENT_ID in env. Spotify credentials can be provided per-request via POST /api/spotify/auth.');
  }
});
