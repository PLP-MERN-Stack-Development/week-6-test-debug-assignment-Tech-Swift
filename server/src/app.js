require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const responseTime = require('response-time');
const app = express();
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(responseTime());


// Simple ping endpoint
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Health endpoint for tests
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Error handler middleware
app.use(errorHandler);

// Export the app for testing
module.exports = app;

// Start the server if run directly
if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
