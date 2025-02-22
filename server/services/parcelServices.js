const Parcel = require("../models/Parcel");

const fetchParcelsByCurrentNode = async (currentNode) => {
  return await Parcel.find({ currentNode });
};

const saveParcelToDatabase = async (parcelData) => {
  return await Parcel.create(parcelData);
};

const deleteParcelByKeys = async (key1, value1, key2, value2) => {
  return await Parcel.findOneAndDelete({ [key1]: value1, [key2]: value2 });
};

async function insertSingleParcel(parcelData) {
  try {
    // Create a new parcel document based on the input parcel data
    const inputParcel = new Parcel(parcelData);
    // topPaths =[];
    try {
      const response = await axios.post(
        "http://localhost:8000/api/graph/get-shortest-paths",
        { city1: inputParcel.source, city2: inputParcel.destination }
      );
      // topPaths = response.data.topPaths;
      console.log(response.data);
      const newParcel = new Parcel({
        ...parcelData,
        path: response.data.topPaths[0].path,
        trackId: inputParcel.parcelId,
      });
      const savedParcel = await newParcel.save();
      console.log("Parcel saved successfully:", savedParcel);
      return savedParcel; // Return the saved parcel document
    } catch (error) {
      console.error("Error fetching shortest paths:", error);
    }
    // newParcel.path = topPaths[0].path;
    // newParcel.trackId = newParcel.parcelId

    // Save the new parcel document to the database
  } catch (err) {
    console.error("Error saving parcel:", err);
    throw err; // Rethrow the error to handle it outside the function
  }
}
async function updateParcelInDatabase(query, update) {
  try {
    const result = await Parcel.updateOne(query, update);
    console.log("Parcel updated:", result);
  } catch (error) {
    console.error("Error updating parcel:", error);
    throw error;
  }
}

async function insertMultipleParcels(parcelDataArray) {
  try {
    // Use Promise.all to insert all parcels in parallel
    const savedParcels = await Promise.all(
      parcelDataArray.map((data) => insertSingleParcel(data))
    );

    console.log("Parcels saved successfully:", savedParcels);
    return savedParcels; // Return the array of saved parcels
  } catch (err) {
    console.error("Error saving parcels:", err);
    throw err; // Rethrow the error to handle it outside the function
  }
}

module.exports = {
  fetchParcelsByCurrentNode,
  saveParcelToDatabase,
  deleteParcelByKeys,
  insertSingleParcel,
  updateParcelInDatabase,
  insertMultipleParcels,
};
