
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const { movies, genres } = require('../../lib/mockData');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Import data function
const importData = async () => {
  try {
    // Clear existing data
    await Movie.deleteMany();
    await Genre.deleteMany();
    
    // Import genres
    await Genre.insertMany(genres);
    console.log('Genres imported successfully');
    
    // Import movies
    await Movie.insertMany(movies);
    console.log('Movies imported successfully');
    
    console.log('Data import completed');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the import
importData();
