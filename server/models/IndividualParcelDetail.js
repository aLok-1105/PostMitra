const mongoose = require('mongoose');

const ParcelDetail = new mongoose.Schema({
parcelId: { type: String, required: true },
  date: { type: String, required: true }, 
  weight: { type: String, required: false },
  cost: { type: String, required: false }, 
  postType: { type: String, required: false }, 
  senderDetails: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true }
  },
  receiverDetails: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true }
  },
  trackingId: {
    type: String,
    default: function() {
        return this.parcelId.slice(0, 3) + this.parcelId.slice(-3); 
    }
  }
});

const IndividualParcelDetail = mongoose.model('IndividualParcelDetail', ParcelDetail);



module.exports = IndividualParcelDetail;
