const mongoose = require("mongoose");

const NodeSchema = new mongoose.Schema({
  city: String,
  pincode: String,
  transportModes: [String],
  spaceAvailability: Number,
});
const Node = mongoose.model("Node", NodeSchema);

module.exports = Node;