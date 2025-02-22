const { WebSocketServer } = require("ws");
const { createServer } = require("http");
const { parse } = require("url");
const port = 8000;
const connections = {};

const handleConnection = async (connection, req) => {
  const { username } = parse(request.url, true).query;
  //   const { username }  = req.url.split('username=')[1];
  console.log(`${username} connected`);

  connections[username] = connection;
  try {
    const parcels = await fetchParcelsByCurrentNode(username);
    const tracks = await fetchTracks();
    if (username !== "tracking") {
      connection.send(
        JSON.stringify({ type: "initial_parcels", data: parcels })
      );
    } else {
      connection.send(JSON.stringify({ type: "tracking", data: tracks }));
    }
  } catch (error) {
    console.error("Error fetching parcels:", error);
  }

  connection.on("message", async (message) => {
    const parcel = JSON.parse(message);
    console.log(`Received message:`, parcel);

    const currentNodeIndex = parcel.path.indexOf(parcel.currentNode);
    if (parcel.action === "Send") {
      if (
        currentNodeIndex !== -1 &&
        currentNodeIndex < parcel.path.length - 1
      ) {
        // Update the parcel for the next node
        const nextNode = parcel.path[currentNodeIndex + 2];
        // parcel.currentNode = nextNode;
        // parcel.type = 'incoming';
        timestamp = new Date().toLocaleString();
        const trackingMessage = {
          parcelId: parcel.parcelId,
          message:
            parcel.typeOfParcel === "speed-post"
              ? `Parcel sent from ${parcel.path[currentNodeIndex]} via Flight(${
                  parcel.path[currentNodeIndex + 1]
                })`
              : `Tracking link: https://www.trainman.in/running-status/${
                  parcel.path[currentNodeIndex + 1]
                }. Parcel sent from ${
                  parcel.path[currentNodeIndex]
                } via Train(${parcel.path[currentNodeIndex + 1]})`,
          time: timestamp,
        };
        // broadcastMessage(parcel.parcelId, trackingMessage);

        insertSingleTrack(trackingMessage)
          .then((savedTrack) => {
            console.log("Saved track:", savedTrack);
          })
          .catch((err) => {
            console.error("Failed to save tracking step:", err);
          });

        try {
          const tracks = await fetchTracks();
          connections["tracking"].send(JSON.stringify(tracks));
        } catch (error) {
          console.error("Error fetching parcels:", error);
        }

        // connections['tracking'].send(
        // JSON.stringify({parcelid: parcel.parcelId, message: trackingMessage})
        // );
        console.log(`Sending parcel to ${nextNode}`);
        const parcelData = {
          parcelId: parcel.parcelId,
          trackId: parcel.trackId,
          source: parcel.source,
          destination: parcel.destination,
          weight: parcel.weight,
          noOfBags: parcel.noOfBags,
          typeOfParcel: parcel.typeOfParcel,
          path: parcel.path,
          type: "incoming",
          currentNode: nextNode,
        };
        const parcelData2 = {
          parcelId: parcel.parcelId,
          trackId: parcel.trackId,
          source: parcel.source,
          destination: parcel.destination,
          weight: parcel.weight,
          noOfBags: parcel.noOfBags,
          typeOfParcel: parcel.typeOfParcel,
          path: parcel.path,
          type: "previous",
          currentNode: parcel.currentNode,
        };
        if (connections[nextNode]) {
          deleteParcelByKeys("parcelId", parcel.parcelId, "type", parcel.type)
            .then((deletedParcel) => {
              if (deletedParcel) {
                console.log("Deleted Parcel:", deletedParcel);
              } else {
                console.log("Parcel not found for deletion.");
              }
            })
            .catch((err) => {
              console.error("Failed to delete parcel:", err);
            });

          saveParcelToDatabase(parcelData)
            .then((savedParcel) => {
              console.log("Saved Parcel:", savedParcel);
            })
            .catch((err) => {
              console.error("Failed to save parcel:", err);
            });

          try {
            const parcels = await fetchParcelsByCurrentNode(nextNode);
            connections[nextNode].send(
              JSON.stringify({ type: "update_parcels", data: parcels })
            );
          } catch (error) {
            console.error("Error fetching parcels:", error);
          }
        } else {
          console.log("invalid path");
        }
        // parcel.type = 'previous';
        // connections[parcel.path[currentNodeIndex]].send(JSON.stringify(parcel));
        await saveParcelToDatabase(parcelData2)
          .then((savedParcel) => {
            console.log("Saved Parcel:", savedParcel);
          })
          .catch((err) => {
            console.error("Failed to save parcel:", err);
          });
        try {
          const parcels = await fetchParcelsByCurrentNode(username);
          connection.send(
            JSON.stringify({ type: "update_parcels", data: parcels })
          );
        } catch (error) {
          console.error("Error fetching parcels:", error);
        }
      } else {
        console.log("Invalid path for sending.");
      }
    } else if (parcel.action === "Received") {
      if (
        currentNodeIndex !== -1 &&
        currentNodeIndex < parcel.path.length - 1
      ) {
        // const trackingMessage = `Parcel received at ${parcel.currentNode}`;
        // connections['tracking'].send(
        //     JSON.stringify({parcelid: parcel.parcelId, message: trackingMessage})
        // );
        timestamp = new Date().toLocaleString();
        const trackingMessage = {
          parcelId: parcel.parcelId,
          message: `Parcel received at ${parcel.currentNode}`,
          time: timestamp,
        };

        insertSingleTrack(trackingMessage)
          .then((savedTrack) => {
            console.log("Saved track:", savedTrack);
          })
          .catch((err) => {
            console.error("Failed to save tracking step:", err);
          });

        try {
          const tracks = await fetchTracks();
          connections["tracking"].send(JSON.stringify(tracks));
        } catch (error) {
          console.error("Error fetching parcels:", error);
        }

        // Update the type for the current node
        // parcel.type = 'outgoing';
        console.log(`Sending parcel to the next node...`);
        const parcelData3 = {
          parcelId: parcel.parcelId,
          trackId: parcel.trackId,
          source: parcel.source,
          destination: parcel.destination,
          weight: parcel.weight,
          noOfBags: parcel.noOfBags,
          typeOfParcel: parcel.typeOfParcel,
          path: parcel.path,
          type: "outgoing",
          currentNode: parcel.currentNode,
        };

        deleteParcelByKeys("parcelId", parcel.parcelId, "type", parcel.type)
          .then((deletedParcel) => {
            if (deletedParcel) {
              console.log("Deleted Parcel:", deletedParcel);
            } else {
              console.log("Parcel not found for deletion.");
            }
          })
          .catch((err) => {
            console.error("Failed to delete parcel:", err);
          });

        await saveParcelToDatabase(parcelData3)
          .then((savedParcel) => {
            console.log("Saved Parcel:", savedParcel);
          })
          .catch((err) => {
            console.error("Failed to save parcel:", err);
          });
        try {
          const parcels = await fetchParcelsByCurrentNode(username);
          connection.send(
            JSON.stringify({ type: "update_parcels", data: parcels })
          );
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
          time: timestamp,
        };

        insertSingleTrack(trackingMessage)
          .then((savedTrack) => {
            console.log("Saved track:", savedTrack);
          })
          .catch((err) => {
            console.error("Failed to save tracking step:", err);
          });

        try {
          const tracks = await fetchTracks();
          connections["tracking"].send(JSON.stringify(tracks));
        } catch (error) {
          console.error("Error fetching parcels:", error);
        }

        timestamp = new Date().toLocaleString();
        const deliveryMessage = {
          parcelId: parcel.parcelId,
          message: `Delivered`,
          time: timestamp,
        };

        insertSingleTrack(deliveryMessage)
          .then((savedTrack) => {
            console.log("Saved track:", savedTrack);
          })
          .catch((err) => {
            console.error("Failed to save tracking step:", err);
          });

        try {
          const tracks = await fetchTracks();
          connections["tracking"].send(JSON.stringify(tracks));
        } catch (error) {
          console.error("Error fetching parcels:", error);
        }

        const parcelData4 = {
          parcelId: parcel.parcelId,
          trackId: parcel.trackId,
          source: parcel.source,
          destination: parcel.destination,
          weight: parcel.weight,
          noOfBags: parcel.noOfBags,
          typeOfParcel: parcel.typeOfParcel,
          path: parcel.path,
          type: "delivered",
          currentNode: parcel.currentNode,
        };

        deleteParcelByKeys("parcelId", parcel.parcelId, "type", parcel.type)
          .then((deletedParcel) => {
            if (deletedParcel) {
              console.log("Deleted Parcel:", deletedParcel);
            } else {
              console.log("Parcel not found for deletion.");
            }
          })
          .catch((err) => {
            console.error("Failed to delete parcel:", err);
          });

        await saveParcelToDatabase(parcelData4)
          .then((savedParcel) => {
            console.log("Saved Parcel:", savedParcel);
          })
          .catch((err) => {
            console.error("Failed to save parcel:", err);
          });

        // await updateParcelInDatabase(
        //   { parcelId: parcel.parcelId, currentNode: parcel.currentNode }, // Query object
        //   { type: "delivered" } // Update object
        // );
        console.log("Delivered:", parcel);
      }
    }
  });

  // Handle connection close
  connection.on("close", () => {
    const disconnectedNode = Object.keys(connections).find(
      (node) => connections[node] === connection
    );
    if (disconnectedNode) {
      console.log(`${disconnectedNode} disconnected`);
      delete connections[disconnectedNode];
    }
  });
};

module.exports = handleConnection;