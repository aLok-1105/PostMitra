
// import { WebSocketServer } from 'ws';
// import { createServer } from 'http';
// import { parse } from 'url';
// import { connect, Schema, model } from "mongoose";

const { WebSocketServer } = require('ws');
const { createServer } = require('http');
const { parse } = require('url');
const { connect, Schema, model } = require('mongoose');
const axios = require('axios');
// const React = require("react");
// const { useEffect, useState } = React;

// module.exports = { React, useEffect, useState };


// MongoDB connection setup
const MONGODB_URI = "mongodb+srv://postmitra:posrmitra121@postmitra.rk7jk.mongodb.net/?retryWrites=true&w=majority&appName=PostMitra";
// const dbName = 'parcelDB';
// const client = new MongoClient(mongoUri);

async function connectToDatabase() {
  try {
    await connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
}


// Call the function to connect
connectToDatabase();

const parcelSchema = new Schema({
  parcelId: { type: String, required: true },
  trackId: { type: String },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  weight: { type: Number, required: true },
  noOfBags: { type: Number, required: true },
  path: { type: [String], required: true },
  type: { type: String, enum: ["incoming", "outgoing", "previous", "delivered"], required: true },
  currentNode: { type: String },
  // action: { type: String },
});

const trackingSchema = new Schema({
  parcelId: { type: String, required: true },
  message: { type: [String], required: true },
  time: { type: [String], required: true }
});

const Parcel = model("Parcel", parcelSchema);
const Track = model("Track", trackingSchema);

const parcelsData = [
  
    { parcelId: "P001", trackId: "", source: "Delhi", destination: "Nagpur", weight: 50, noOfBags: 10,  path: [], type: "outgoing", currentNode: "Delhi" },
    { parcelId: "P002", trackId: "", source: "Delhi", destination: "Patna", weight: 50, noOfBags: 10,  path: [], type: "outgoing", currentNode: "Delhi" },
    { parcelId: "P003", trackId: "", source: "Nagpur", destination: "Mumbai", weight: 50, noOfBags: 10,  path: [], type: "outgoing", currentNode: "Nagpur" },
    { parcelId: "P003", trackId: "", source: "Mumbai", destination: "Nagpur", weight: 50, noOfBags: 10,  path: [], type: "outgoing", currentNode: "Mumbai" },
    { parcelId: "P004", trackId: "", source: "Patna", destination: "Nagpur", weight: 50, noOfBags: 10,  path: [], type: "outgoing", currentNode: "Patna" },
    { parcelId: "P005", trackId: "", source: "Patna", destination: "Mumbai", weight: 50, noOfBags: 10,  path: [], type: "outgoing", currentNode: "Patna" },
  
];


const server = createServer();
const wsServer = new WebSocketServer({ server });

const port = 8080;
const connections = {};

insertMultipleParcels(parcelsData)
  .then(savedParcels => {
    console.log("Saved Parcels:", savedParcels);
  })
  .catch(err => {
    console.error("Failed to save parcels:", err);
  });


wsServer.on('connection', async (connection, request) => {
  const { username } = parse(request.url, true).query;
//   const { username }  = req.url.split('username=')[1];
  console.log(`${username} connected`);

  // Store the connection for each currentNode
  connections[username] = connection;
  try {
    const parcels = await fetchParcelsByCurrentNode(username);
    const tracks = await fetchTracks();
    if(username !== "tracking"){connection.send(JSON.stringify({ type: "initial_parcels", data: parcels }));}
    else{connection.send(JSON.stringify({ type: "tracking", data: tracks }));}
  } catch (error) {
    console.error("Error fetching parcels:", error);
  }

  // Handle incoming messages
  connection.on('message', async (message) => {
    const parcel = JSON.parse(message);
    console.log(`Received message:`, parcel);

    const currentNodeIndex = parcel.path.indexOf(parcel.currentNode);
    if (parcel.action === 'Send') {
      if (currentNodeIndex !== -1 && currentNodeIndex < parcel.path.length - 1) {
        // Update the parcel for the next node
        const nextNode = parcel.path[currentNodeIndex + 1];
        // parcel.currentNode = nextNode;
        // parcel.type = 'incoming';
        timestamp = new Date().toLocaleString();
        const trackingMessage = {
          parcelId: parcel.parcelId,
          message: `Parcel sent from ${parcel.path[currentNodeIndex]}`,
          time: timestamp
        }
        // broadcastMessage(parcel.parcelId, trackingMessage);
        
        insertSingleTrack(trackingMessage)
          .then(savedTrack => {
            console.log("Saved track:", savedTrack);
          })
          .catch(err => {
            console.error("Failed to save tracking step:", err);
          });

          try {
            const tracks = await fetchTracks();
            connections['tracking'].send(JSON.stringify(tracks));
          } catch (error) {
            console.error("Error fetching parcels:", error);
          }

        // connections['tracking'].send(
            // JSON.stringify({parcelid: parcel.parcelId, message: trackingMessage})
        // );
        console.log(`Sending parcel to ${nextNode}`);
        const parcelData = {
          parcelId: parcel.parcelId,
          path: parcel.path,
          type: 'incoming',
          currentNode: nextNode
        };
        const parcelData2 = {
          parcelId: parcel.parcelId,
          path: parcel.path,
          type: 'previous',
          currentNode: parcel.currentNode
        };
        if (connections[nextNode]) {

          deleteParcelByKeys("parcelId", parcel.parcelId, "type", parcel.type)
          .then(deletedParcel => {
          if (deletedParcel) {
            console.log("Deleted Parcel:", deletedParcel);
          } else {
            console.log("Parcel not found for deletion.");
          }
          })
          .catch(err => {
            console.error("Failed to delete parcel:", err);
          });

          insertSingleParcel(parcelData)
          .then(savedParcel => {
            console.log("Saved Parcel:", savedParcel);
          })
          .catch(err => {
            console.error("Failed to save parcel:", err);
          });

          try {
            const parcels = await fetchParcelsByCurrentNode(nextNode);
            connections[nextNode].send(JSON.stringify({ type: "update_parcels", data: parcels }));
          } catch (error) {
            console.error("Error fetching parcels:", error);
          }
        }
        else{
            console.log("invalid path")
        }
        // parcel.type = 'previous';
        // connections[parcel.path[currentNodeIndex]].send(JSON.stringify(parcel));
        await insertSingleParcel(parcelData2)
        .then(savedParcel => {
          console.log("Saved Parcel:", savedParcel);
        })
        .catch(err => {
          console.error("Failed to save parcel:", err);
        });
        try {
          const parcels = await fetchParcelsByCurrentNode(username);
          connection.send(JSON.stringify({ type: "update_parcels", data: parcels }));
        } catch (error) {
          console.error("Error fetching parcels:", error);
        }
      } else {
        console.log('Invalid path for sending.');
      }
    } else if (parcel.action === 'Received') {
      if (currentNodeIndex !== -1 && currentNodeIndex < parcel.path.length - 1) {
        // const trackingMessage = `Parcel received at ${parcel.currentNode}`;
        // connections['tracking'].send(
        //     JSON.stringify({parcelid: parcel.parcelId, message: trackingMessage})
        // );
        timestamp = new Date().toLocaleString();
        const trackingMessage = {
          parcelId: parcel.parcelId,
          message: `Parcel received at ${parcel.currentNode}`,
          time: timestamp
        }

        insertSingleTrack(trackingMessage)
          .then(savedTrack => {
            console.log("Saved track:", savedTrack);
          })
          .catch(err => {
            console.error("Failed to save tracking step:", err);
          });

          try {
            const tracks = await fetchTracks();
            connections['tracking'].send(JSON.stringify(tracks));
          } catch (error) {
            console.error("Error fetching parcels:", error);
          }

        // Update the type for the current node
        // parcel.type = 'outgoing';
        console.log(`Sending parcel to the next node...`);
        const parcelData3 = {
          parcelId: parcel.parcelId,
          path: parcel.path,
          type: 'outgoing',
          currentNode: parcel.currentNode
        };

        deleteParcelByKeys("parcelId", parcel.parcelId, "type", parcel.type)
          .then(deletedParcel => {
          if (deletedParcel) {
            console.log("Deleted Parcel:", deletedParcel);
          } else {
            console.log("Parcel not found for deletion.");
          }
          })
          .catch(err => {
            console.error("Failed to delete parcel:", err);
          });

        await insertSingleParcel(parcelData3)
        .then(savedParcel => {
          console.log("Saved Parcel:", savedParcel);
        })
        .catch(err => {
          console.error("Failed to save parcel:", err);
        });
        try {
          const parcels = await fetchParcelsByCurrentNode(username);
          connection.send(JSON.stringify({ type: "update_parcels", data: parcels }));
        } catch (error) {
          console.error("Error fetching parcels:", error);
        }
        // if (connections[parcel.currentNode]) {
        //   connections[parcel.currentNode].send(
        //     JSON.stringify(parcel)
        //   );
        
        // }
        // else{
        // console.log("invalid path")
        // }
      } else {
        // const trackingMessage = `Parcel received at ${parcel.currentNode}`;
        // connections['tracking'].send(
        //     JSON.stringify({parcelid: parcel.parcelId, message: trackingMessage})
        // );
        // const deliveryMessage = `Delivered`;
        // connections['tracking'].send(
        //     JSON.stringify({parcelid: parcel.parcelId, message: deliveryMessage})
        // );
        timestamp = new Date().toLocaleString();
        const trackingMessage = {
          parcelId: parcel.parcelId,
          message: `Parcel received at ${parcel.currentNode}`,
          time: timestamp
        }

        insertSingleTrack(trackingMessage)
          .then(savedTrack => {
            console.log("Saved track:", savedTrack);
          })
          .catch(err => {
            console.error("Failed to save tracking step:", err);
          });

          try {
            const tracks = await fetchTracks();
            connections['tracking'].send(JSON.stringify(tracks));
          } catch (error) {
            console.error("Error fetching parcels:", error);
          }

          timestamp = new Date().toLocaleString();
          const deliveryMessage = {
            parcelId: parcel.parcelId,
            message: `Delivered`,
            time: timestamp
          }
  
          insertSingleTrack(deliveryMessage)
            .then(savedTrack => {
              console.log("Saved track:", savedTrack);
            })
            .catch(err => {
              console.error("Failed to save tracking step:", err);
            });
  
            try {
              const tracks = await fetchTracks();
              connections['tracking'].send(JSON.stringify(tracks));
            } catch (error) {
              console.error("Error fetching parcels:", error);
            }

        const parcelData4 = {
          parcelId: parcel.parcelId,
          path: parcel.path,
          type: 'delivered',
          currentNode: parcel.currentNode
        };

        deleteParcelByKeys("parcelId", parcel.parcelId, "type", parcel.type)
          .then(deletedParcel => {
          if (deletedParcel) {
            console.log("Deleted Parcel:", deletedParcel);
          } else {
            console.log("Parcel not found for deletion.");
          }
          })
          .catch(err => {
            console.error("Failed to delete parcel:", err);
          });
          
        await insertSingleParcel(parcelData4)
        .then(savedParcel => {
          console.log("Saved Parcel:", savedParcel);
        })
        .catch(err => {
          console.error("Failed to save parcel:", err);
        });

        // await updateParcelInDatabase(
        //   { parcelId: parcel.parcelId, currentNode: parcel.currentNode }, // Query object
        //   { type: "delivered" } // Update object
        // );
        console.log('Delivered:', parcel);
      }
    }
  });

  // Handle connection close
  connection.on('close', () => {
    const disconnectedNode = Object.keys(connections).find(
      (node) => connections[node] === connection
    );
    if (disconnectedNode) {
      console.log(`${disconnectedNode} disconnected`);
      delete connections[disconnectedNode];
    }
  });
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

async function fetchParcelsByCurrentNode(currentNode) {
  try {
    const parcels = await Parcel.find({ currentNode });
    return parcels;
  } catch (error) {
    console.error("Error fetching parcels by current node:", error);
    throw error;
  }
}  
async function fetchTracks() {
    try {
      const tracks = await Track.find({});
      return tracks;
    } catch (error) {
      console.error("Error fetching tracking information by parcel id:", error);
      throw error;
    }
  }

async function saveParcelToDatabase(parcel) {
  try {
    const newParcel = new Parcel(parcel);
    await newParcel.save();
    console.log("Parcel saved successfully:", newParcel);
    return newParcel;
  } catch (error) {
    console.error("Error saving parcel to database:", error);
    throw error;
  }
}

async function updateParcelInDatabase(query, update) {
  try {
    const result = await Parcel.updateOne(query, update);
    console.log("Parcel updated:", result);
  } catch (error) {
    console.error("Error updating parcel:", error);
    throw error;
  }
}


// async function insertMultipleParcels(parcelDataArray) {
//   try {
//     // Create multiple parcel documents based on the input array of parcel data
//     const parcels = parcelDataArray.map(data => new Parcel(data));
    
//     // Save all parcels to the database
//     const savedParcels = await Parcel.insertMany(parcels);
    
//     console.log("Parcels saved successfully:", savedParcels);
//     return savedParcels;  // Return the array of saved parcels
//   } catch (err) {
//     console.error("Error saving parcels:", err);
//     throw err;  // Rethrow the error to handle it outside the function
//   }
// }
async function insertMultipleParcels(parcelDataArray) {
  try {
    // Use Promise.all to insert all parcels in parallel
    const savedParcels = await Promise.all(
      parcelDataArray.map(data => insertSingleParcel(data))
    );

    console.log("Parcels saved successfully:", savedParcels);
    return savedParcels; // Return the array of saved parcels
  } catch (err) {
    console.error("Error saving parcels:", err);
    throw err; // Rethrow the error to handle it outside the function
  }
}


async function insertSingleParcel(parcelData) {
  try {
    // Create a new parcel document based on the input parcel data
    newParcel = new Parcel(parcelData);
    topPaths =[];
    try {
      const response = await axios.post('http://localhost:8000/api/graph/get-shortest-paths', { city1: newParcel.source, city2: newParcel.destination });
      topPaths = response.data.topPaths;
    } catch (error) {
      console.error("Error fetching shortest paths:", error);
    }
    newParcel.path = topPaths[0];
    newParcel.trackId = newParcel.parcelId
    
    // Save the new parcel document to the database
    const savedParcel = await newParcel.save();
    
    console.log("Parcel saved successfully:", savedParcel);
    return savedParcel;  // Return the saved parcel document
  } catch (err) {
    console.error("Error saving parcel:", err);
    throw err;  // Rethrow the error to handle it outside the function
  }
}

async function insertSingleTrack(trackingMessage) {
  try {
    // Create a new parcel document based on the input parcel data
    const newTrack = new Track(trackingMessage);
    
    // Save the new parcel document to the database
    const savedTrack = await newTrack.save();
    
    console.log("Tracking step saved successfully:", savedTrack);
    return savedTrack;  // Return the saved parcel document
  } catch (err) {
    console.error("Error saving tracking step:", err);
    throw err;  // Rethrow the error to handle it outside the function
  }
}

async function deleteParcelByKeys(key1, value1, key2, value2) {
  try {
    // Build the filter object dynamically
    const filter = { [key1]: value1, [key2]: value2 };

    // Find and delete the parcel matching the filter
    const deletedParcel = await Parcel.findOneAndDelete(filter);
    
    if (deletedParcel) {
      console.log("Parcel deleted successfully:", deletedParcel);
      return deletedParcel; // Return the deleted parcel document
    } else {
      console.log("No parcel found with the given keys:", filter);
      return null; // Indicate no parcel was found to delete
    }
  } catch (err) {
    console.error("Error deleting parcel:", err);
    throw err; // Rethrow the error to handle it outside the function
  }
}

// Utility function to broadcast messages
// function broadcastMessage(parcelId, message) {
//   Object.values(connections).forEach((conn) => {
//     conn.send(JSON.stringify({ parcelId, message }));
//   });
// }
