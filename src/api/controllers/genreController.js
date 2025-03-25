
const Genre = require('../models/Genre');

// Get all genres
const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find({});
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single genre by ID
const getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findOne({ id: req.params.id });
    
    if (genre) {
      res.json(genre);
    } else {
      res.status(404).json({ message: 'Genre not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new genre
const createGenre = async (req, res) => {
  try {
    const genre = new Genre(req.body);
    const newGenre = await genre.save();
    res.status(201).json(newGenre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getGenres,
  getGenreById,
  createGenre
};
