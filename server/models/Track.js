const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({
  parcelId: { type: String, required: true },
  message: { type: [String], required: true },
  time: { type: [String], required: true }
});

const Track = mongoose.model("Track", trackingSchema);
module.exports = Track;