
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  genres: [{
    type: String,
    required: true
  }],
  director: {
    type: String,
    required: true
  },
  cast: [{
    type: String,
    required: true
  }],
  posterUrl: {
    type: String,
    required: true
  },
  backdropUrl: {
    type: String,
    required: true
  },
  trailerUrl: {
    type: String
  },
  trending: {
    type: Boolean,
    default: false
  },
  popular: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
