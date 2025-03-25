
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

// Format genres data
const formattedGenres = genres.map(genre => ({
  id: genre.id,
  name: genre.name
}));

// Format movies data with proper schema
const formattedMovies = movies.map(movie => ({
  id: movie.id,
  title: movie.title,
  description: movie.description,
  releaseYear: movie.releaseYear,
  duration: movie.duration,
  rating: movie.rating,
  genres: movie.genres,
  director: movie.director,
  cast: movie.cast,
  posterUrl: movie.posterUrl,
  backdropUrl: movie.backdropUrl,
  trailerUrl: movie.trailerUrl || '',
  trending: movie.trending || false,
  popular: movie.popular || false
}));

// Import data function
const importData = async () => {
  try {
    // Clear existing data
    await Movie.deleteMany();
    await Genre.deleteMany();
    
    // Import genres
    await Genre.insertMany(formattedGenres);
    console.log('Genres imported successfully');
    
    // Import movies
    await Movie.insertMany(formattedMovies);
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
