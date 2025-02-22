const Node = require('../models/Node');
const Adjacency = require('../models/Adjacency');
const { cities } = require('./cityData');

async function initializeData() {
  const existingNodes = await Node.find();
  const existingAdjacency = await Adjacency.findOne();

  if (existingNodes.length === 0) {
    for (const city of cities) {
      await Node.create({
        city,
        pincode: Math.floor(100000 + Math.random() * 900000).toString(),
        transportModes: ['Road', 'Train', 'Flight'],
        spaceAvailability: Math.random() * 100,
      });
    }
    console.log('Nodes initialized.');
  }

  if (!existingAdjacency) {
    const matrix = Array(cities.length)
      .fill(null)
      .map(() => Array(cities.length).fill(null));

    for (let i = 0; i < cities.length; i++) {
      for (let j = 0; j < cities.length; j++) {
        if (i !== j) {
          matrix[i][j] = Math.floor(100 + Math.random() * 400); // Random travel time
        }
      }
    }

    await Adjacency.create({ matrix });
    console.log('Adjacency matrix initialized.');
  } else {
    console.log('Adjacency matrix already exists.');
  }
}

module.exports = initializeData;
