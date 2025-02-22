const express = require('express');
const { updateTravelTime, getShortestPaths } = require('../controllers/graphControllers');

const router = express.Router();

router.put('/update-travel-time', updateTravelTime);
router.post('/get-shortest-paths', getShortestPaths);

module.exports = router;
