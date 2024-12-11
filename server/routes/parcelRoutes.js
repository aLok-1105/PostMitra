const express = require('express');
const IndividualParcelDetail = require('../models/IndividualParcelDetail');
const authenticate = require('../middleware/auth');

const router = express.Router();  

const cityMappings = {
  "110": "Delhi",
  "143": "Amritsar",
  "226": "Lucknow",
  "342": "Jodhpur",
  "380": "Ahmedabad",
  "400": "Mumbai",
  "403": "Panaji",
  "440": "Nagpur",
  "462": "Bhopal",
  "474": "Gwalior",
  "500": "Hyderabad",
  "560": "Bangalore",
  "600": "Chennai",
  "682": "Kochi",
  "700": "Kolkata",
  "781": "Guwahati",
  "800": "Patna"
};

// Register route
router.post('/registerParcel', async (req, res) => {
  try {
    const parcelData = new IndividualParcelDetail(req.body);
    // console.log(req.body);
    
    const savedParcel = await parcelData.save();

    res.status(201).json({
      message: 'Parcel created successfully',
      data: savedParcel
    });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/showParcels', authenticate, async (req, res) => {
  try {
    const { email } = req.user;
    const pincode = String(email).slice(3, 6); // Extract the starting pincode
    
    // Use MongoDB's aggregation to group parcels by source and destination pincodes
    const parcels = await IndividualParcelDetail.aggregate([
      {
        $match: { 'senderDetails.pincode': new RegExp(`^${pincode}`) } // Match source pincodes starting with `pincode`
      },
      {
        $group: {
          _id: { 
            src: '$senderDetails.pincode', 
            dest: '$receiverDetails.pincode' 
          },
          count: { $sum: 1 } // Count parcels in each group
        }
      },
      {
        $project: {
          _id: 0,
          src: '$_id.src',
          dest: '$_id.dest',
          count: 1
        }
      }
    ]);
    
    console.log(`Parcel counts for pincode ${pincode}:`, parcels);
    
    res.status(200).json({
      message: 'Parcels data fetched successfully',
      parcels
    });
  } catch (error) {
    console.error("Error fetching parcels:", error);
    res.status(500).json({ message: 'Error fetching parcels' });
  }
});


module.exports = router;  