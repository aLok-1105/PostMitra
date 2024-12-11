import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Checkbox, Button, Tab, Tabs, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Data generation function
const createData = (srNo, source, destination, weight, parcels, status) => {
  return { srNo, source, destination, weight, parcels, status };
};

// Sample data for different parcel categories
const sourceRows = [
  createData(1, 'Mumbai', 'Delhi', '500 kg', 50, true),
  createData(2, 'Pune', 'Bangalore', '300 kg', 30, false),
];

const transitRows = [
  createData(3, 'Chennai', 'Hyderabad', '450 kg', 45, true),
  createData(4, 'Kolkata', 'Jaipur', '250 kg', 25, false),
];

const destinationRows = [
  createData(5, 'Ahmedabad', 'Lucknow', '350 kg', 35, true),
];

const Officer = () => {
  const [shortestPaths, setShortestPaths] = useState([]);
  const navigate = useNavigate();

  // State to manage selected category (Source, Transit, Destination)
  const [selectedTab, setSelectedTab] = useState('source');

  // Function to handle navigation on "Send" button click
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

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Render tables based on the selected tab (state)
  const renderTable = (rows) => (
    <Table className="table-container" aria-label="parcel data table">
  <TableHead>
    <TableRow>
      <TableCell style={{ borderRight: '1px solid #ddd' }}>Sr No</TableCell>
      <TableCell style={{ borderRight: '1px solid #ddd' }}>Source (City)</TableCell>
      <TableCell style={{ borderRight: '1px solid #ddd' }}>Destination (City)</TableCell>
      <TableCell style={{ borderRight: '1px solid #ddd' }} align="right">Total Weight</TableCell>
      <TableCell style={{ borderRight: '1px solid #ddd' }} align="right">Total Number of Parcels</TableCell>
      <TableCell style={{ borderRight: '1px solid #ddd' }} align="center">Status</TableCell>
      <TableCell align="center">Action</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {rows.map((row) => (
      <TableRow key={row.srNo}>
        <TableCell style={{ borderRight: '1px solid #ddd' }}>{row.srNo}</TableCell>
        <TableCell style={{ borderRight: '1px solid #ddd' }}>{row.source}</TableCell>
        <TableCell style={{ borderRight: '1px solid #ddd' }}>{row.destination}</TableCell>
        <TableCell style={{ borderRight: '1px solid #ddd' }} align="right">{row.weight}</TableCell>
        <TableCell style={{ borderRight: '1px solid #ddd' }} align="right">{row.parcels}</TableCell>
        <TableCell style={{ borderRight: '1px solid #ddd' }} align="center">
          <Checkbox checked={row.status} />
        </TableCell>
        <TableCell align="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSend(row.source, row.destination)}
          >
            Send
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

  );

  return (
    <>
      <div 
        style={
          {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }
        }
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="parcel categories"
          centered
          variant="fullWidth"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '50%',  
            minHeight: '48px',  // Reduce the height of the tabs
          }}
        >
          <Tab label="Source Parcels" value="source" />
          <Tab label="Transit Parcels" value="transit" />
          <Tab label="Destination Parcels" value="destination" />
        </Tabs>
      </div>

      {/* Conditional rendering based on the selected tab */}
      <Box sx={{ marginTop: '20px' }}>
        {selectedTab === 'source' && (
          <TableContainer component={Paper}>
            {renderTable(sourceRows)}
          </TableContainer>
        )}

        {selectedTab === 'transit' && (
          <TableContainer component={Paper}>
            {renderTable(transitRows)}
          </TableContainer>
        )}

        {selectedTab === 'destination' && (
          <TableContainer component={Paper}>
            {renderTable(destinationRows)}
          </TableContainer>
        )}
      </Box>
      {shortestPaths.length > 0 && (
        <div>
          <h3>Top Shortest Paths:</h3>
          <ul>
            {shortestPaths.map((path, index) => (
              <li key={index}>
                Path: {path.path.join(' -> ')} | Distance: {path.distance} km
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Officer;
