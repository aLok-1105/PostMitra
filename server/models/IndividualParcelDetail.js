const mongoose = require('mongoose');

const ParcelDetail = new mongoose.Schema({
parcelId: { type: String, required: true },
  date: { type: String, required: true }, 
  weight: { type: Number, required: false },
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
        return this.parcelId.slice(0, 3) + this.parcelId.slice(-4); 
    }
  }
});

const IndividualParcelDetail = mongoose.model('IndividualParcelDetail', ParcelDetail);


const countDetailsSchema = new mongoose.Schema({
    shortId: { type: String, unique: true, required: true }, 
    count: { type: Number, default: 0 }, 
    details: [
        {
            trackingId: { type: String, required: true }, 
            path: [
                {
                    location: { type: String, required: true }, 
                    status: { type: String, required: true },  
                    timestamp: { type: Date, default: Date.now } 
                }
            ],
            currentStatus: { type: String, required: true } 
        }
    ]
});

const ParcelsDetail = mongoose.model('ParcelsDetail', countDetailsSchema);

module.exports = IndividualParcelDetail, ParcelsDetail;
