import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import useWebSocket from "react-use-websocket";
// import axios from "axios"; // For API requests
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";

export function Tracking() {
  const { parcelId } = useParams(); // Extract parcelId from the URL
  const location = useLocation(); // To check the full path
  const [inputParcelId, setInputParcelId] = useState(parcelId || ""); // Set default parcelId from URL or empty
  const [filteredParcelId, setFilteredParcelId] = useState(parcelId || "");
  // const [trackingData, setTrackingData] = useState([]); // Holds tracking messages

  // const fetchTrackingData = async (id) => {
  //   try {
  //     const response = await axios.get(`/api/tracking/${id}`); // API endpoint for tracking data
  //     setTrackingData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching tracking data:", error);
  //     setTrackingData([]); // Clear data on error
  //   }
  // };

  // useEffect(() => {
  //   if (parcelId) {
  //     fetchTrackingData(parcelId);
  //   }
  // }, [parcelId]);

  const WS_URL = `ws://127.0.0.1:8080?username=tracking`; // Assume "tracking" as username for WebSocket
  const { lastJsonMessage } = useWebSocket(WS_URL, { share: true });
  const [trackingData, setTrackingData] = useState({});

  useEffect(() => {
    if (lastJsonMessage) {
      // const { parcelid, message } = lastJsonMessage;
      // // Add a new entry for the parcel with a timestamp
      // setTrackingData((prev) => {
      //   const timestamp = new Date().toLocaleString();
      //   const updatedParcelData = prev[parcelid]
      //     ? [...prev[parcelid], { message, timestamp }]
      //     : [{ message, timestamp }];
      //   return { ...prev, [parcelid]: updatedParcelData };
      // });
      setTrackingData(lastJsonMessage.data)
    }
  }, [lastJsonMessage]);

  const handleFilterSubmit = () => {
    console.log(lastJsonMessage)
    console.log(trackingData)
    setFilteredParcelId(inputParcelId);
    
  };
  // const handleFilterSubmit = () => {
    //   setFilteredParcelId(inputParcelId.trim());
    //   if (inputParcelId.trim()) {
  //     fetchTrackingData(inputParcelId.trim());
  //   }
  // };
  // const filteredData = filteredParcelId ? trackingData[filteredParcelId] : null;
  const filterByParcelId = (data, id) => {    
    if (!Array.isArray(data)) {
        // console.error("Data is not an array:", data);
        return [];
    }
    return data.filter(item => {
        console.log("Processing item:", item.parcelId);
        return item.parcelId == id;
    });
};

  const filteredMessages = filterByParcelId(trackingData, filteredParcelId);
  console.log(trackingData);
  console.log(filteredParcelId);
  
  console.log(filteredMessages);
  
  return (
    <div>
      <h1>Parcel Tracking</h1>
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Parcel ID"
          variant="outlined"
          value={inputParcelId}
          onChange={(e) => setInputParcelId(e.target.value)}
        />
        <Button
          variant="contained"
          style={{ marginLeft: "10px" }}
          onClick={handleFilterSubmit}
        >
          Submit
        </Button>
      </div>

      {filteredParcelId ? (
        filteredMessages ? (
          <div>
            <h3>Tracking for Parcel ID: {filteredParcelId}</h3>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMessages.map((update, index) => (
                    <TableRow key={index}>
                      <TableCell>{update.message}</TableCell>
                      <TableCell>{update.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <p>No tracking data available for Parcel ID: {filteredParcelId}</p>
        )
      ) : (
        <p>Enter a Parcel ID to view its tracking details.</p>
      )}
      {/* {filteredParcelId ? (
        filteredData ? (
          <div>
            <h3>Tracking for Parcel ID: {filteredParcelId}</h3>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((update, index) => (
                    <TableRow key={index}>
                      <TableCell>{update.message}</TableCell>
                      <TableCell>{update.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <p>No tracking data available for Parcel ID: {filteredParcelId}</p>
        )
      ) : (
        <p>Enter a Parcel ID to view its tracking details.</p>
      )} */}
    </div>
  );
}
