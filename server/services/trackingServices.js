const Track = require('../models/Tracking');

const fetchTracks = async () => {
  return await Track.find();
};

const insertSingleTrack = async (trackingMessage) => {
  return await Track.create(trackingMessage);
};

module.exports = { fetchTracks, insertSingleTrack };
