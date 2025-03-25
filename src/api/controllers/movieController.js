
const Movie = require('../models/Movie');

// Get all movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single movie by ID
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({ id: req.params.id });
    
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get movies by genre
const getMoviesByGenre = async (req, res) => {
  try {
    const genreId = req.params.genreId;
    const movies = await Movie.find({ genres: genreId });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trending movies
const getTrendingMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ trending: true });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get popular movies
const getPopularMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ popular: true });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search movies
const searchMovies = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  getMoviesByGenre,
  getTrendingMovies,
  getPopularMovies,
  searchMovies
};
