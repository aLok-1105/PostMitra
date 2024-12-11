const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 
const parcelRoutes = require('./routes/parcelRoutes'); 
const cookieParser = require('cookie-parser');
const axios = require('axios');
const cors = require('cors');

connectDB();

const app = express();
app.use(express.urlencoded({extended: true}));

app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true // Required for cookies
  }));



app.use('/auth', authRoutes);  // All routes in authRoutes.js will be prefixed with /auth
app.use('/parcel', parcelRoutes);


// MongoDB connection
// mongoose.connect(
//   'mongodb+srv://alokranjan11052003:alok@cluster0.eq7el.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
//   { useNewUrlParser: true, useUnifiedTopology: true }
// );

// Cities list
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



// Utility function to calculate the time difference in hours and minutes
function calculateTimeDifference(startTime, endTime) {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  let totalStartMinutes = startHours * 60 + startMinutes;
  let totalEndMinutes = endHours * 60 + endMinutes;

  if (totalEndMinutes < totalStartMinutes) {
    // Train crosses midnight, add 24 hours to the end time
    totalEndMinutes += 24 * 60;
  }

  const totalMinutes = totalEndMinutes - totalStartMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

// Main function to calculate time between two cities
function calculateTime(city1, city2){
  return 1;
}

async function updateTravelTime(city1, city2) {
    try {
        const time = calculateTime(city1, city2)
      if (!city1 || !city2 || !time) {
        throw new Error('City1, City2, and time are required.');
      }
  
      const index1 = cities.indexOf(city1);
      const index2 = cities.indexOf(city2);      

      if (index1 === -1 || index2 === -1) {
        throw new Error('One or both cities not found.');
      }
  
      // Fetch the adjacency matrix
      const adjacencyData = await Adjacency.findOne();
      if (!adjacencyData) throw new Error('Adjacency matrix not found.');
  
      const matrix = adjacencyData.matrix;
  
      // Update the travel time in the matrix
      matrix[index1][index2] = time;
      matrix[index2][index1] = time;
  
      // Recalculate all-pairs shortest paths
      const { dist, nextNode } = floydWarshall(matrix);
  
      // Update the database with the new matrix using `findOneAndUpdate`
      const updatedData = await Adjacency.findOneAndUpdate(
        { _id: adjacencyData._id }, // Filter by document ID
        { matrix: dist },           // Update with new matrix
        { new: true, useFindAndModify: false } // Return updated document
      );

    //   console.log(updatedData);
    // adjacencyData.matrix = dist;
    await adjacencyData.save(); 
      
      if (!updatedData) {
        throw new Error('Failed to update the adjacency matrix.');
      }
  
      return {
        message: 'Travel time updated and matrix recalculated.',
        updatedMatrix: updatedData.matrix,
        nextNode,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Error while updating travel time: ${error.message}`);
    }
  }
// Endpoint to update travel time and recalculate the matrix
app.put('/api/graph/update-travel-time', async (req, res) => {
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

    // Update the direct travel time
    matrix[index1][index2] = time;
    matrix[index2][index1] = time;

    // Recalculate all-pairs shortest paths
    const { dist, nextNode } = floydWarshall(matrix);

    // Save updated matrix
    adjacencyData.matrix = dist;
    await adjacencyData.save();

    res.status(200).json({ message: 'Travel time updated and matrix recalculated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating travel time.' });
  }
});

// Endpoint to get top 3 shortest paths
app.post('/api/graph/get-shortest-paths', async (req, res) => {
  try {
    const { city1, city2 } = req.body;

    if (!city1 || !city2) {
      return res.status(400).json({ error: 'City1 and City2 are required.' });
    }

    const index1 = cities.indexOf(city1);
    const index2 = cities.indexOf(city2);

    if (index1 === -1 || index2 === -1) {
      return res.status(404).json({ error: 'City not found.' });
    }

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

    // Find additional paths with intermediate stops
    for (let i = 0; i < cities.length && topPaths.length < 3; i++) {
      if (i !== index1 && i !== index2 && dist[index1][i] < Infinity && dist[i][index2] < Infinity) {
        const intermediatePath = [
          ...reconstructPath(index1, i),
          ...reconstructPath(i, index2).slice(1)
        ];
        const intermediateDistance = dist[index1][i] + dist[i][index2];

        // Check for duplicates before adding
        if (!topPaths.some(tp => JSON.stringify(tp.path) === JSON.stringify(intermediatePath))) {
          topPaths.push({ path: intermediatePath, distance: intermediateDistance });
        }
      }
    }

    if (topPaths.length === 0) {
      return res.status(404).json({ error: 'No paths found.' });
    }

    res.status(200).json({ topPaths });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while retrieving paths.' });
  }
});


// Floyd-Warshall Algorithm
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

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
