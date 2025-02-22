const { Schema, model } = require("mongoose");
const parcelSchema = new Schema({
  parcelId: { type: String, required: true },
  trackId: { type: String },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  weight: { type: Number, required: true },
  noOfBags: { type: Number, required: true },
  path: { type: [String], required: true },
  typeOfParcel: {
    type: String,
    enum: ["speed-post", "economy"],
    required: true,
  },
  type: {
    type: String,
    enum: ["incoming", "outgoing", "previous", "delivered"],
    required: true,
  },
  currentNode: { type: String },
});

module.exports = model("Parcel", parcelSchema);
