
const express = require('express');
const router = express.Router();
const { getGenres, getGenreById, createGenre } = require('../controllers/genreController');

// Get all genres
router.get('/', getGenres);

// Get a single genre by ID
router.get('/:id', getGenreById);

// Create a new genre
router.post('/', createGenre);

module.exports = router;
