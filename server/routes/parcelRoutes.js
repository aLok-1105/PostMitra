const express = require("express");
const IndividualParcelDetail = require("../models/IndividualParcelDetail");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Register route
router.post("/registerParcel", async (req, res) => {
  try {
    const parcelData = new IndividualParcelDetail(req.body);
    // console.log(req.body);

    const savedParcel = await parcelData.save();

    const senderPhone = "+918840110024";
    const message = `Parcel with ID: ${parcelData.parcelId} has been registered successfully.`;

    // const response = await twilioClient.messages.create({
    //   body: message,
    //   from: twilioPhoneNumber,
    //   to: senderPhone,
    // });

    console.log("Twilio response:", response.sid);

    res.status(201).json({
      message: "Parcel created successfully",
      data: savedParcel,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

router.get("/showParcels", authenticate, async (req, res) => {
  try {
    const { email } = req.user;
    const pincode = String(email).slice(3, 6); // Extract the starting pincode

    // Use MongoDB's aggregation pipeline
    const parcels = await IndividualParcelDetail.aggregate([
      {
        $match: {
          "senderDetails.pincode": new RegExp(`^${pincode}`), // Match source pincodes starting with `pincode`
        },
      },
      {
        $addFields: {
          numericWeight: { $toDouble: "$weight" }, // Convert weight to numeric
        },
      },
      {
        $group: {
          _id: {
            src: "$senderDetails.pincode",
            dest: "$receiverDetails.pincode",
            postType: "$postType", // Group by source, destination, and post type
          },
          count: { $sum: 1 }, // Count parcels in each group
          cumulativeWeight: { $sum: "$numericWeight" }, // Use numeric weight
        },
      },
      {
        $project: {
          _id: 0,
          src: "$_id.src",
          dest: "$_id.dest",
          postType: "$_id.postType",
          count: 1,
          cumulativeWeight: 1,
        },
      },
      {
        $sort: { src: 1, dest: 1, postType: 1 }, // Optional: Sort by source, destination, and post type
      },
    ]);

    console.log(`Parcel data for pincode ${pincode}:`, parcels);

    res.status(200).json({
      message: "Parcels data fetched successfully",
      parcels,
    });
  } catch (error) {
    console.error("Error fetching parcels:", error);
    res.status(500).json({ message: "Error fetching parcels" });
  }
});

router.post("/delay-alert", async (req, res) => {
  const senderPhone = "+918840110024";
  const message = `Your parcel is delayed at ${req.body.username} due to some calamity. Further updates will be shared.`;;
});

module.exports = router;
