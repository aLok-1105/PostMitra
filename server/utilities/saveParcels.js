const { connect, Schema, model } = require('mongoose');
const axios = require('axios');


const MONGODB_URI = "mongodb+srv://postmitra:posrmitra121@postmitra.rk7jk.mongodb.net/?retryWrites=true&w=majority&appName=PostMitra";
// const dbName = 'parcelDB';
// const client = new MongoClient(mongoUri);

async function connectToDatabase() {
  try {
    await connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
}


// Call the function to connect
connectToDatabase();

// const uri = "mongodb://localhost:27017/transportDetails"; // Replace with your database URL

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to transportDetails database"))
//   .catch((error) => console.error("Error connecting to transportDetails database:", error));


  const transportDetailsSchema = new Schema({
    city1: { type: String, required: true },
    city2: { type: String, required: true },
    trainNo: { type: String, required: true },
    flightNo: { type: String, required: true },
  });
  
  const TransportDetails = model('TransportDetails', transportDetailsSchema);

const parcelSchema = new Schema({
  parcelId: { type: String, required: true },
  trackId: { type: String },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  weight: { type: Number, required: true },
  noOfBags: { type: Number, required: true },
  path: { type: [String], required: true },
  typeOfParcel: { type: String, enum: ["speed-post", "economy"], required: true },
  type: { type: String, enum: ["incoming", "outgoing", "previous", "delivered"], required: true },
  currentNode: { type: String },
  // action: { type: String },
});

const Parcel = model("Parcel", parcelSchema);

// const parcelsData = [
  
//   // { parcelId: "P001", trackId: "", source: "Delhi", destination: "Nagpur", weight: 50, noOfBags: 10,  path: [], typeOfParcel: "speed-post", type: "outgoing", currentNode: "Delhi" },
//   // { parcelId: "P002", trackId: "", source: "Delhi", destination: "Patna", weight: 50, noOfBags: 10,  path: [], typeOfParcel: "economy", type: "outgoing", currentNode: "Delhi" },
//   // { parcelId: "P003", trackId: "", source: "Nagpur", destination: "Mumbai", weight: 50, noOfBags: 10,  path: [], typeOfParcel: "speed-post", type: "outgoing", currentNode: "Nagpur" },
//   // { parcelId: "P003", trackId: "", source: "Mumbai", destination: "Nagpur", weight: 50, noOfBags: 10,  path: [], typeOfParcel: "speed-post", type: "outgoing", currentNode: "Mumbai" },
//   // { parcelId: "P004", trackId: "", source: "Patna", destination: "Nagpur", weight: 50, noOfBags: 10,  path: [], typeOfParcel: "speed-post", type: "outgoing", currentNode: "Patna" },
//   { parcelId: "P005", trackId: "", source: "Patna", destination: "Mumbai", weight: 50, noOfBags: 10,  path: [], typeOfParcel: "speed-post", type: "outgoing", currentNode: "Patna" },

// ];
const cities = [
  "Ahmedabad", "Amritsar", "Bangalore", "Bhopal", "Chennai",
  "Delhi", "Guwahati", "Gwalior", "Hyderabad", "Jodhpur",
  "Kochi", "Kolkata", "Lucknow", "Mumbai", "Nagpur",
  "Panaji", "Patna", "Visakhapatnam"
];

const typesOfParcel = ["speed-post", "economy"];
const types = ["outgoing", "incoming"];

function generateParcels(numParcels) {
  const parcels = [];

  for (let i = 1; i <= numParcels; i++) {
    const sourceIndex = Math.floor(Math.random() * cities.length);
    let destinationIndex;

    // Ensure source and destination are not the same
    do {
      destinationIndex = Math.floor(Math.random() * cities.length);
    } while (destinationIndex === sourceIndex);

    const weight = (Math.floor(Math.random() * 3) + 1) * 50; // Random weight: 50, 100, or 150
    const typeOfParcel = typesOfParcel[Math.floor(Math.random() * typesOfParcel.length)];
    const type = types[Math.floor(Math.random() * types.length)];

    const parcel = {
      parcelId: `P${i.toString().padStart(3, "0")}`,
      trackId: "",
      source: cities[sourceIndex],
      destination: cities[destinationIndex],
      weight: weight,
      noOfBags: Math.ceil(weight / 10),
      path: [],
      typeOfParcel: typeOfParcel,
      type: type,
      currentNode: cities[sourceIndex],
    };

    parcels.push(parcel);
  }

  return parcels;
}

const parcels = generateParcels(150);
// console.log(parcels);


insertMultipleParcels(parcels)
  .then(savedParcels => {
    console.log("Saved Parcels:", savedParcels);
  })
  .catch(err => {
    console.error("Failed to save parcels:", err);
  });


  async function insertMultipleParcels(parcelDataArray) {
    try {
      // Use Promise.all to insert all parcels in parallel
      const savedParcels = await Promise.all(
        parcelDataArray.map(data => insertSingleParcel(data))
      );
  
      console.log("Parcels saved successfully:", savedParcels);
      return savedParcels; // Return the array of saved parcels
    } catch (err) {
      console.error("Error saving parcels:", err);
      throw err; // Rethrow the error to handle it outside the function
    }
  }
  
  
  // async function insertSingleParcel(parcelData) {
  //   try {
  //     // Create a new parcel document based on the input parcel data
  //     const inputParcel = new Parcel(parcelData);
  //     // topPaths =[];
  //     try {
  //       const response = await axios.post('http://localhost:8000/api/graph/get-shortest-paths', { city1: inputParcel.source, city2: inputParcel.destination });
  //       // topPaths = response.data.topPaths;
  //       console.log(response.data);
  //       const newParcel = new Parcel({ ...parcelData, path: response.data.topPaths[0].path, trackId: inputParcel.parcelId });
  //       const savedParcel = await newParcel.save();
  //       console.log("Parcel saved successfully:", savedParcel);
  //       return savedParcel;  // Return the saved parcel document
  //     } catch (error) {
  //       console.error("Error fetching shortest paths:", error);
  //     }
  //     // newParcel.path = topPaths[0].path;
  //     // newParcel.trackId = newParcel.parcelId
      
  //     // Save the new parcel document to the database
      
  //   } catch (err) {
  //     console.error("Error saving parcel:", err);
  //     throw err;  // Rethrow the error to handle it outside the function
  //   }
  // }

  async function insertSingleParcel(parcelData) {
    try {
      // Create a new parcel document based on the input parcel data
      const inputParcel = new Parcel(parcelData);
  
      // Fetch the shortest path
      let shortestPath;
      try {
        const response = await axios.post('http://localhost:8000/api/graph/get-shortest-paths', {
          city1: inputParcel.source,
          city2: inputParcel.destination,
        });
  
        shortestPath = response.data.topPaths[0].path; // Example: ['Patna', 'Bhopal', 'Mumbai']
        console.log("Shortest path:", shortestPath);
      } catch (error) {
        console.error("Error fetching shortest paths:", error);
        throw new Error("Failed to fetch shortest paths");
      }
  
      // Update the path with train or flight numbers based on typeOfParcel
      const updatedPath = [];
  
      for (let i = 0; i < shortestPath.length - 1; i++) {
        const city1 = shortestPath[i];
        const city2 = shortestPath[i + 1];
  
        // Fetch transport details for the segment
        const transportDetail = await TransportDetails.findOne({ city1, city2 });
  
        if (!transportDetail) {
          console.error(`Transport details not found for segment: ${city1} -> ${city2}`);
          throw new Error(`Transport details missing for ${city1} to ${city2}`);
        }
  
        // Add city1 to the updated path
        updatedPath.push(city1);
  
        // Add the transport detail based on typeOfParcel
        if (inputParcel.typeOfParcel === 'speed-post') {
          updatedPath.push(transportDetail.flightNo);
        } else if (inputParcel.typeOfParcel === 'economy') {
          updatedPath.push(transportDetail.trainNo);
        } else {
          console.error("Invalid typeOfParcel value:", inputParcel.typeOfParcel);
          throw new Error("Invalid typeOfParcel");
        }
      }
  
      // Add the final destination city to the updated path
      updatedPath.push(shortestPath[shortestPath.length - 1]);
  
      console.log("Updated path:", updatedPath);
  
      // Save the parcel with the updated path
      const newParcel = new Parcel({
        ...parcelData,
        path: updatedPath,
        trackId: inputParcel.parcelId,
      });
  
      const savedParcel = await newParcel.save();
      console.log("Parcel saved successfully:", savedParcel);
      return savedParcel; // Return the saved parcel document
  
    } catch (err) {
      console.error("Error saving parcel:", err);
      throw err; // Rethrow the error to handle it outside the function
    }
  }
  