
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');
const genreRoutes = require('./routes/genreRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
