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
  Typography
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";

export function Home({ username }) {
  const WS_URL = `ws://127.0.0.1:8080`;
  
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    queryParams: { username }, // Pass username to WebSocket server
    onOpen: () => console.log("WebSocket connection opened"),
    onClose: () => console.log("WebSocket connection closed"),
    share: true,
  });

  const [tabValue, setTabValue] = useState(0);
  const [parcels, setParcels] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  const handleSend = async(source, destination) => {
    navigate('/map', { state: { source, destination } });
  };

  useEffect(() => {
    if (lastJsonMessage) {
      setParcels(lastJsonMessage.data);
    }
  }, [lastJsonMessage]);


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

    // // Send message to the server
    sendJsonMessage(updatedParcel);

    // // Remove the parcel from the current list
    setParcels((prev) => prev.filter((p) => p.parcelId !== parcel.parcelId));
    // handleSend(updatedParcel.source, updatedParcel.destination);
  };

  // Add parcel to the correct list based on server response
  useEffect(() => {
    if (lastJsonMessage) {
      const newParcel = lastJsonMessage;
      setParcels((prev) => [...prev, newParcel]);
    }
  }, [lastJsonMessage]);

  const handleCheck = (action, parcel) => {
    handleSend(parcel.source, parcel.destination);
  };

  // Handle Track button click
  // const handleTrack = (parcelId) => {
  //   navigate(`/tracking`, { state: { parcelId } }); // Pass the parcelId to the tracking page
  // };
  const handleSendAll = (filteredParcels) => {
    filteredParcels.forEach((parcel) => {
      handleAction('send', parcel); // Assuming 'send' is the action you want to perform
  });
  };
  const handleAlert = async () => {
    try {
      // Send POST request to backend
      const response = await axios.post('http://localhost:8000/parcel/delay-alert', {username: username}, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, 
    });
      // console.log(parcelId);
      
      alert('Alert has been Sent');
    } catch (error) {
      // Handle error during request
      console.error("Error submitting parcel data:", error);
      alert("Failed to submit alert. Please try again.");
    }
  };


  return (
      <>
    <div>
      <h1 style={{color: 'white'}} >{username} - Dashboard</h1>
      {/* <Button onClick={() => handleSendAll(filteredParcels)}>Send All</Button>
      <Button onClick={() => handleAlert()}>Calamitiy Alert</Button> */}
      </div>
    <Typography style={{
      fontSize: 50,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '40px',
      color: 'black'

    }}>Sorting Hub Officer {username}</Typography>
    {/* <Button variant="outlined"  style={{width: "200px", backgroundColor: "red"}}> */}
    {/* Alert for Natural Calamities
</Button> */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: "space-around"  
    }}>
    <button style={{border:"2px solid red",  borderRadius:'10px', backgroundColor: '#CA0B00', width:"300px"  }} onClick={handleAlert}>Alert for Natural Calamities</button>
    <button style={{border:"2px solid green", borderRadius:'10px', backgroundColor: 'green', width:"300px"  }} >Send All</button>
    </div>
      <div 
        style={
          {
            display: 'flex',
            justifyContent:'space-around',
            marginBottom: '20px',
            padding:'20px'
          }
        }
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent:'space-around',
          width: '100%'
        }}>
        <div style={{marginBottom: '2px'  }} >
        <Tabs
  value={tabValue}
  onChange={handleTabChange}
  aria-label="parcel tabs"
  centered
  TabIndicatorProps={{
    style: { backgroundColor: 'red' }, // Custom underline color
  }}
  style={{ textAlign: 'center', paddingTop: '40px' }}
>
  <Tab
    label="Incoming Parcels"
    style={{ color: 'black', fontWeight: tabValue === 0 ? 'bold' : 'normal' }}
  />
  <Tab
    label="Outgoing Parcels"
    style={{ color: 'black', fontWeight: tabValue === 1 ? 'bold' : 'normal' }}
  />
  <Tab
    label="Previous Parcels"
    style={{ color: 'black', fontWeight: tabValue === 2 ? 'bold' : 'normal' }}
  />
</Tabs>
      </div>
      <div style={{display:'flex', justifyContent:'space-around'}}>
      <TableContainer component={Paper} >
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#ffe5e5', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
              <TableCell style={{
        borderRight: '1px solid #ddd', 
        borderTopLeftRadius: '8px', 
        fontWeight: 'bold'
      }}>Tracking ID</TableCell>
              <TableCell style={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Source</TableCell>
              <TableCell style={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Destination</TableCell>
              <TableCell style={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Optimal Path</TableCell>
              <TableCell style={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Weight</TableCell>
              <TableCell style={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>No. of Parcels</TableCell>
              <TableCell style={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Type of Parcels</TableCell>
              <TableCell style={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Alternate Path</TableCell>
              <TableCell style={{
        borderTopRightRadius: '8px', 
        fontWeight: 'bold', 
        textAlign: 'center'
      }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredParcels.map((parcel) => (
              <TableRow key={parcel.parcelId}>
                <TableCell style={{ borderRight: '1px solid #ddd' }}>{parcel.trackId}</TableCell>
                <TableCell style={{ borderRight: '1px solid #ddd' }}>{parcel.source}</TableCell>
                <TableCell style={{ borderRight: '1px solid #ddd' }}>{parcel.destination}</TableCell>
                <TableCell style={{ borderRight: '1px solid #ddd' }}>{parcel.path.join(" -> ")}</TableCell>
                <TableCell style={{ borderRight: '1px solid #ddd' }}>{parcel.weight}</TableCell>
                <TableCell style={{ borderRight: '1px solid #ddd' }}>{parcel.noOfBags}</TableCell>
                <TableCell style={{ borderRight: '1px solid #ddd' }}>{parcel.typeOfParcel}</TableCell>
                <TableCell align="center"><Button variant="contained" style={{background:'#ff5252'}}
                  onClick={() =>
                        handleCheck("Check", parcel)
                  
                      }>Check</Button></TableCell>
                <TableCell align="center">
                  {tabValue === 0 || tabValue === 1 ? (
                    <Button variant="contained" style={{background:'#008000'}}
                      onClick={() =>
                        handleAction(tabValue === 0 ? "Received" : "Send", parcel)
                  
                      }
                    >
                      {tabValue === 0 ? "Received" : "Send"}
                    </Button>
                  ) : (
                    <Button
  variant="contained"
  
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
      </div>
    </div>
    </>
  );
}
