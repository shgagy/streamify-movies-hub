
const express = require('express');
const router = express.Router();
const { 
  getMovies, 
  getMovieById, 
  getMoviesByGenre,
  getTrendingMovies,
  getPopularMovies,
  searchMovies
} = require('../controllers/movieController');

// Get all movies
router.get('/', getMovies);

// Get trending movies
router.get('/trending', getTrendingMovies);

// Get popular movies
router.get('/popular', getPopularMovies);

// Search movies
router.get('/search', searchMovies);

// Get movies by genre
router.get('/genre/:genreId', getMoviesByGenre);

// Get a single movie by ID
router.get('/:id', getMovieById);

module.exports = router;
