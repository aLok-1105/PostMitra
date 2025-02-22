const mongoose = require('mongoose');

const AdjacencySchema = new mongoose.Schema({
  matrix: [[Number]],
});
const Adjacency = mongoose.model('Adjacency', AdjacencySchema);

module.exports = Adjacency;