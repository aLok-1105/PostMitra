const mongoose = require('mongoose');
const { default: App } = require('../../client/src/App');

const cities = [
    'Ahmedabad', 'Amritsar', 'Bangalore', 'Bhopal', 'Chennai',
    'Delhi', 'Guwahati', 'Gwalior', 'Hyderabad', 'Jodhpur',
    'Kochi', 'Kolkata', 'Lucknow', 'Mumbai', 'Nagpur',
    'Panaji', 'Patna', 'Visakhapatnam'
  ];
  
  const cityMappings = {
    'Ahmedabad': ['ADI', 380001],
    'Amritsar': ['ASR', 143001],
    'Bangalore': ['SBC', 560001],
    'Bhopal': ['BPL', 462001],
    'Chennai': ['MAS', 600001],
    'Delhi': ['NDLS', 110001],
    'Guwahati': ['GHY', 781001],
    'Gwalior': ['GWL', 474001],
    'Hyderabad': ['HYB', 500001],
    'Jodhpur': ['JU', 342001],
    'Kochi': ['ERS', 682001],
    'Kolkata': ['HWH', 700001],
    'Lucknow': ['LKO', 226001],
    'Mumbai': ['CSTM', 400001],
    'Nagpur': ['NGP', 440001],
    'Panaji': ['QLM', 403001],
    'Patna': ['PNBE', 800001],
    'Visakhapatnam': ['VSKP', 530001]
  };
  
  
  // MongoDB schema for node data
  const NodeSchema = new mongoose.Schema({
    city: String,
    pincode: String,
    transportModes: [String],
    spaceAvailability: Number,
  });
  const Node = mongoose.model('Node', NodeSchema);
  
  // MongoDB schema for adjacency matrix
  const AdjacencySchema = new mongoose.Schema({
    matrix: [[Number]],
  });
  const Adjacency = mongoose.model('Adjacency', AdjacencySchema);
  
  // Helper function to initialize sample data
  async function initializeData() {lllll
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
  }
  else{
      for (let i = 0; i < cities.length; i++) {
        for (let j = 0; j < cities.length; j++) {
          if (i !== j) {
              updateTravelTime(cities[i], cities[j]);
          }
        }
      }
      console.log("Done!!");
      
  }
  }

  function floydWarshall(matrix) {
    const n = matrix.length;
    const dist = matrix.map(row => row.slice());
    const nextNode = Array.from({ length: n }, () => Array(n).fill(null));
  
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && dist[i][j] !== null) {
          nextNode[i][j] = j;
        }
      }
    }
  
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            nextNode[i][j] = nextNode[i][k];
          }
        }
      }
    }
  
    return { dist, nextNode };
  }
  
  


await initializeData();
module.exports = Adjacency, Node;
