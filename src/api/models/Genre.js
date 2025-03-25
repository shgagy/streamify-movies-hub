
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
