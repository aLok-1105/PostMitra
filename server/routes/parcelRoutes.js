const express = require('express');
const IndividualParcelDetail = require('../models/IndividualParcelDetail');

const router = express.Router();  

// Register route
router.post('/registerParcel', async (req, res) => {
  try {
    const parcelData = new IndividualParcelDetail(req.body);

    const savedParcel = await parcelData.save();

    res.status(201).json({
      message: 'Parcel created successfully',
      data: savedParcel
    });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});


module.exports = router;  