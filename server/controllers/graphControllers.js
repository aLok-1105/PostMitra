const Adjacency = require('../models/Adjacency');
const { floydWarshall } = require('../utils/floydWarshall');
const { cities } = require('../utils/cityData');

// Function to update travel time and recalculate paths
const updateTravelTime = async (req, res) => {
  try {
    const { city1, city2, time } = req.body;

    if (!city1 || !city2 || !time) {
      return res.status(400).json({ error: 'City1, City2, and time are required.' });
    }

    const index1 = cities.indexOf(city1);
    const index2 = cities.indexOf(city2);
    if (index1 === -1 || index2 === -1) {
      return res.status(404).json({ error: 'One or both cities not found.' });
    }

    const adjacencyData = await Adjacency.findOne();
    if (!adjacencyData) return res.status(500).json({ error: 'Adjacency matrix not found.' });

    const matrix = adjacencyData.matrix;
    matrix[index1][index2] = time;
    matrix[index2][index1] = time;

    const { dist, nextNode } = floydWarshall(matrix);
    adjacencyData.matrix = dist;
    await adjacencyData.save();

    res.status(200).json({ message: 'Travel time updated and matrix recalculated.', nextNode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating travel time.' });
  }
};

// Function to get shortest paths
const getShortestPaths = async (req, res) => {
  try {
    const { city1, city2 } = req.body;
    if (!city1 || !city2) return res.status(400).json({ error: 'City1 and City2 are required.' });

    const index1 = cities.indexOf(city1);
    const index2 = cities.indexOf(city2);
    if (index1 === -1 || index2 === -1) return res.status(404).json({ error: 'City not found.' });

    const adjacencyData = await Adjacency.findOne();
    if (!adjacencyData) return res.status(500).json({ error: 'Adjacency matrix not found.' });

    const matrix = adjacencyData.matrix;
    const { dist, nextNode } = floydWarshall(matrix);

    function reconstructPath(i, j) {
      const path = [];
      while (i !== j) {
        if (nextNode[i][j] === null) break;
        path.push(cities[i]);
        i = nextNode[i][j];
      }
      path.push(cities[j]);
      return path;
    }

    const shortestPath = reconstructPath(index1, index2);
    const topPaths = [{ path: shortestPath, distance: dist[index1][index2] }];

    res.status(200).json({ topPaths });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while retrieving paths.' });
  }
};

module.exports = { updateTravelTime, getShortestPaths };
