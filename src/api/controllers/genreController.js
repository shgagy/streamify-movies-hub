
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

module.exports = {
  getGenres
};
