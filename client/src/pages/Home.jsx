import { useNavigate,useParams } from "react-router-dom"; // Import useNavigate for navigation
import useWebSocket from "react-use-websocket";
// import axios from "axios"; // For API requests
import {
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";

export function Home({ username }) {
  const WS_URL = `ws://127.0.0.1:8080`;
  // const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
  //   share: true,
  //   queryParams: { username },
  // });
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    queryParams: { username }, // Pass username to WebSocket server
    onOpen: () => console.log("WebSocket connection opened"),
    onClose: () => console.log("WebSocket connection closed"),
    share: true,
  });

  const [tabValue, setTabValue] = useState(0);
  const [parcels, setParcels] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  // Simulate initial parcels
  // useEffect(() => {
    // const initialParcels = [
    //   { parcelId: "P001", path: ["Nagpur", "Delhi", "Patna"], type: "incoming", currentNode: "Nagpur" },
    //   { parcelId: "P002", path: ["Patna", "Nagpur", "Delhi"], type: "incoming", currentNode: "Patna" },
    //   { parcelId: "P003", path: ["Delhi", "Nagpur"], type: "outgoing", currentNode: "Delhi" },
    //   { parcelId: "P004", path: ["Delhi", "Patna", "Nagpur"], type: "outgoing", currentNode: "Delhi" },
    //   { parcelId: "P005", path: ["Nagpur", "Patna", "Delhi"], type: "incoming", currentNode: "Nagpur" },
    //   { parcelId: "P006", path: ["Nagpur", "Delhi"], type: "outgoing", currentNode: "Nagpur" },
    //   { parcelId: "P007", path: ["Patna", "Nagpur"], type: "outgoing", currentNode: "Patna" },
    // ];
  //   setParcels(initialParcels);
  // }, []);

  const handleSend = async(source, destination) => {
    navigate('/map', { state: { source, destination } });
    // try{
    //   const response = await axios.post('http://localhost:8000/api/graph/get-shortest-paths', { city1: source, city2: destination });

    //   const paths = response.data.topPaths;
    //   setShortestPaths(paths);
    // }
    // catch(err){
    //   console.error("Error fetching shortest paths:", err);
    // }
  };

  useEffect(() => {
    if (lastJsonMessage) {
      setParcels(lastJsonMessage.data);
      // if (lastJsonMessage.type === "initial_parcels") {
      //   // Initial parcel list
      //   setParcels(lastJsonMessage.data);
      // } else if (lastJsonMessage.type === "update_parcel") {
      //   // Handle parcel updates
      //   const updatedParcel = lastJsonMessage.data;

      //   setParcels((prev) => {
      //     const index = prev.findIndex(
      //       (parcel) => parcel.parcelId === updatedParcel.parcelId
      //     );

      //     if (index === -1) {
      //       return [...prev, updatedParcel]; // Add new parcel
      //     } else {
      //       const updatedParcels = [...prev];
      //       updatedParcels[index] = updatedParcel; // Update existing parcel
      //       return updatedParcels;
      //     }
      //   });
      // }
    }
  }, [lastJsonMessage]);

  // useEffect(() => {
  //   const fetchParcels = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8000/api/parcels");
  //       setParcels(response.data);
  //     } catch (error) {
  //       console.error("Error fetching parcels:", error);
  //     }
  //   };

  //   fetchParcels();
  // }, []);


  // Handle tab switching
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter parcels dynamically
  const filteredParcels = parcels.filter((parcel) => {
    if (tabValue === 0) {
      return parcel.currentNode === username && parcel.type === "incoming";
    } else if (tabValue === 1) {
      return parcel.currentNode === username && parcel.type === "outgoing";
    } else {
      return parcel.type === "previous";
    }
  });

  // Handle actions (e.g., "Received" or "Send")
  const handleAction = (action, parcel) => {
    const updatedParcel = { ...parcel, action, currentNode: username };

    // Send message to the server
    sendJsonMessage(updatedParcel);

    // Remove the parcel from the current list
    setParcels((prev) => prev.filter((p) => p.parcelId !== parcel.parcelId));
    handleSend(updatedParcel.path[0], updatedParcel.path[updatedParcel.path.length - 1]);
  };

  // const handleAction = async (action, parcel) => {
  //   const updatedParcel = { ...parcel, action, currentNode: username };

  //   try {
  //     // Update parcel in the database
  //     await axios.put(`http://localhost:8000/api/parcels/${parcel.parcelId}`, updatedParcel);

  //     // Remove the parcel from the current list
  //     setParcels((prev) => prev.filter((p) => p.parcelId !== parcel.parcelId));
  //   } catch (error) {
  //     console.error("Error updating parcel:", error);
  //   }
  // };

  // Add parcel to the correct list based on server response
  useEffect(() => {
    if (lastJsonMessage) {
      const newParcel = lastJsonMessage;
      setParcels((prev) => [...prev, newParcel]);
    }
  }, [lastJsonMessage]);

  // Handle Track button click
  const handleTrack = (parcelId) => {
    navigate(`/tracking`, { state: { parcelId } }); // Pass the parcelId to the tracking page
  };

  return (
    <div>
      <h1>{username} - Dashboard</h1>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="parcel tabs">
        <Tab label="Incoming Parcels" />
        <Tab label="Outgoing Parcels" />
        <Tab label="Previous Parcels" />
      </Tabs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parcel ID</TableCell>
              <TableCell>Path</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredParcels.map((parcel) => (
              <TableRow key={parcel.parcelId}>
                <TableCell>{parcel.parcelId}</TableCell>
                <TableCell>{parcel.path.join(" -> ")}</TableCell>
                <TableCell>
                  {tabValue === 0 || tabValue === 1 ? (
                    <Button
                      onClick={() =>
                        handleAction(tabValue === 0 ? "Received" : "Send", parcel)
                  
                      }
                    >
                      {tabValue === 0 ? "Received" : "Send"}
                    </Button>
                  ) : (
                    <Button
  variant="contained"
  color="primary"
  onClick={() => navigate(`/tracking/${parcel.parcelId}`)}
>
  Track
</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
