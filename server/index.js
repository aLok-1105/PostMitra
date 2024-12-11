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

  

//   if (!existingAdjacency) {
//     const matrix = Array(cities.length)
//       .fill(null)
//       .map(() => Array(cities.length).fill(null));

//     for (let i = 0; i < cities.length; i++) {
//       for (let j = 0; j < cities.length; j++) {
//         if (i !== j) {
//           matrix[i][j] = Math.floor(100 + Math.random() * 400); // Random travel time
//         }
//       }
//     }
//     try {
//       await Adjacency.create({ matrix });
//     } catch (error) {
//       console.log("teri maa ki chut")
//     }
    
//     // console.log('Adjacency matrix initialized.');
// }
if (!existingAdjacency) {
  const matrix = [
      [0, 1740, 1955, 1025, 1900, 860, 3390, 990, 1310, 505, 1945, 2265, 1545, 530, 1025, 999999, 2100, 1870],
      [1740, 0, 99999999, 1030, 99999999, 540, 2875, 696, 99999999, 1055, 3000, 2226, 1137, 1965, 1955, 999999, 1730, 2820],
      [1955, 99999999, 0, 1690, 320, 2260, 3190, 1965, 700, 2440, 685, 2015, 2555, 1310, 1425, 999999, 2635, 1360],
      [1025, 1030, 1690, 0, 1425, 550, 99999999, 279, 865, 1535, 2130, 1765, 681, 772, 365, 999999, 1165, 1340],
      [1900, 99999999, 320, 1425, 0, 1950, 2845, 1652, 785, 2490, 674, 1695, 2320, 1320, 1045, 999999, 2245, 735],
      [860, 540, 2260, 550, 1950, 0, 2498, 223, 1680, 725, 2995, 1641, 635, 1395, 925, 999999, 1100, 1900],
      [3390, 2875, 3190, 99999999, 2845, 2498, 0, 99999999, 2720, 3050, 3322, 1030, 9999999, 3015, 2285, 999999, 1138, 1975],
      [990, 696, 1965, 279, 1652, 223, 99999999, 0, 1195, 99999999, 2450, 1395, 570, 1205, 654, 999999, 9999999, 1629],
      [1310, 99999999, 700, 865, 785, 1680, 2720, 1195, 0, 1960, 1415, 1805, 1685, 815, 520, 999999, 1995, 725],
      [505, 1055, 2440, 1535, 2490, 725, 3050, 99999999, 1960, 0, 2295, 1740, 1035, 935, 1450, 999999, 1845, 2230],
      [1945, 3000, 685, 2130, 674, 2995, 3322, 2450, 1415, 2295, 0, 2338, 2861, 9999999, 999999, 999999, 2980, 1685],
      [2265, 2226, 2015, 1765, 1695, 1641, 1030, 1395, 1805, 1740, 2338, 0, 1250, 1990, 1140, 999999, 590, 999999],
      [1545, 1137, 2555, 681, 2320, 635, 9999999, 570, 1685, 1035, 2861, 1250, 0, 1365, 1055, 999999, 705, 999999],
      [530, 1965, 1310, 772, 1320, 1395, 3015, 1205, 815, 935, 9999999, 1990, 1365, 0, 815, 999999, 2095, 1750],
      [1025, 1955, 1425, 365, 1045, 925, 2285, 654, 520, 1450, 999999, 1140, 1055, 815, 0, 999999, 1205, 970],
      [999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999, 999999, 0, 999999, 999999],
      [2100, 1730, 2635, 1165, 2245, 1100, 1138, 999999, 1995, 1845, 2980, 590, 705, 2095, 1205, 999999, 0, 1480],
      [1870, 2820, 1360, 1340, 735, 1900, 1975, 1629, 725, 2230, 1685, 999999, 999999, 1750, 970, 999999, 1480, 0]
  ];

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

// async function updateTravelTime(city1, city2) {
//     try {
//         const time = calculateTime(city1, city2)
//       if (!city1 || !city2 || !time) {
//         throw new Error('City1, City2, and time are required.');
//       }
  
//       const index1 = cities.indexOf(city1);
//       const index2 = cities.indexOf(city2);      

//       if (index1 === -1 || index2 === -1) {
//         throw new Error('One or both cities not found.');
//       }
  
//       // Fetch the adjacency matrix
//       const adjacencyData = await Adjacency.findOne();
//       if (!adjacencyData) throw new Error('Adjacency matrix not found.');
  
//       const matrix = adjacencyData.matrix;
  
//       // Update the travel time in the matrix
//       matrix[index1][index2] = time;
//       matrix[index2][index1] = time;
  
//       // Recalculate all-pairs shortest paths
//       const { dist, nextNode } = floydWarshall(matrix);
  
//       // Update the database with the new matrix using `findOneAndUpdate`
//       const updatedData = await Adjacency.findOneAndUpdate(
//         { _id: adjacencyData._id }, // Filter by document ID
//         { matrix: dist },           // Update with new matrix
//         { new: true, useFindAndModify: false } // Return updated document
//       );

//     //   console.log(updatedData);
//     // adjacencyData.matrix = dist;
//     await adjacencyData.save(); 
      
//       if (!updatedData) {
//         throw new Error('Failed to update the adjacency matrix.');
//       }
  
//       return {
//         message: 'Travel time updated and matrix recalculated.',
//         updatedMatrix: updatedData.matrix,
//         nextNode,
//       };
//     } catch (error) {
//       console.error(error);
//       throw new Error(`Error while updating travel time: ${error.message}`);
//     }
//   }
// Endpoint to update travel time and recalculate the matrix
// app.put('/api/graph/update-travel-time', async (req, res) => {
//   try {
//     const { city1, city2, time } = req.body;

//     if (!city1 || !city2 || !time) {
//       return res.status(400).json({ error: 'City1, City2, and time are required.' });
//     }

//     const index1 = cities.indexOf(city1);
//     const index2 = cities.indexOf(city2);

//     if (index1 === -1 || index2 === -1) {
//       return res.status(404).json({ error: 'One or both cities not found.' });
//     }

//     const adjacencyData = await Adjacency.findOne();
//     if (!adjacencyData) return res.status(500).json({ error: 'Adjacency matrix not found.' });

//     const matrix = adjacencyData.matrix;

//     // Update the direct travel time
//     matrix[index1][index2] = time;
//     matrix[index2][index1] = time;

//     // Recalculate all-pairs shortest paths
//     const { dist, nextNode } = floydWarshall(matrix);

//     // Save updated matrix
//     adjacencyData.matrix = dist;
//     await adjacencyData.save();

//     res.status(200).json({ message: 'Travel time updated and matrix recalculated.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error while updating travel time.' });
//   }
// });

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
  initializeData();
  console.log(`Server running on port ${PORT}`);
});
