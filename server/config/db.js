const mongoose = require("mongoose");
const initializeData = require('../utils/dataInitializer');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
    
    await initializeData(); // Ensures initialization runs after connection
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;