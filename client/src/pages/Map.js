import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Icon } from "leaflet";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './map.css';

const Map = () => {
  const markers = [
    { geocode: [28.7041, 77.1025], popUp: "Delhi" },
    { geocode: [26.9124, 75.7873], popUp: "Jaipur" },
    { geocode: [19.0760, 72.8777], popUp: "Mumbai" },
    { geocode: [26.2183, 78.1828], popUp: "Gwalior" },
    { geocode: [9.9312, 76.2673], popUp: "Kochi" },
    { geocode: [25.5941, 85.1376], popUp: "Patna" },
    { geocode: [13.0827, 80.2707], popUp: "Chennai" },
    { geocode: [31.6340, 74.8723], popUp: "Amritsar" },
    { geocode: [26.8467, 80.9462], popUp: "Lucknow" },
    { geocode: [21.1458, 79.0882], popUp: "Nagpur" },
    { geocode: [12.9716, 77.5946], popUp: "Bangalore" },
    { geocode: [26.1445, 91.7362], popUp: "Guwahati" },
    { geocode: [17.6869, 83.2185], popUp: "Vizag" },
    { geocode: [23.0225, 72.5714], popUp: "Ahmedabad" },
    { geocode: [23.2599, 77.4126], popUp: "Bhopal" },
    { geocode: [17.3850, 78.4867], popUp: "Hyderabad" },
    { geocode: [26.2389, 73.0243], popUp: "Jodhpur" },
    { geocode: [22.5726, 88.3639], popUp: "Kolkata" },
    { geocode: [15.2993, 74.1240], popUp: "Panaji" },
    { geocode: [19.2961, 84.7915], popUp: "Visakhapatnam" },
  ];

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [25, 25],
  });

  const sourceIcon = new Icon({
    iconUrl: "https://cdn1.iconfinder.com/data/icons/social-messaging-ui-color/254000/66-512.png", // Blue icon
    iconSize: [45, 45],
  });
  
  const destinationIcon = new Icon({
    iconUrl: "https://cdn1.iconfinder.com/data/icons/social-messaging-ui-color/254000/66-512.png", // Green icon
    iconSize: [45, 45],
  });

  const location = useLocation();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [topPaths, setTopPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [finalizedPath, setFinalizedPath] = useState("");

  useEffect(() => {
    if (location.state) {
      const { source: passedSource, destination: passedDestination } = location.state;
      if (passedSource) setSource(passedSource);
      if (passedDestination) setDestination(passedDestination);
    }
  }, [location.state]);

  const fetchShortestPaths = async () => {
    if (!source || !destination) {
      alert("Please enter both source and destination.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/graph/get-shortest-paths', { city1: source, city2: destination });
      setTopPaths(response.data.topPaths);
    } catch (error) {
      console.error("Error fetching shortest paths:", error);
    } finally {
      setLoading(false);
    }
  };

  const finalizePath = (path) => {
    setFinalizedPath(path);
    alert(`Path finalized: ${path.join(" -> ")}`);
  };

  const renderPathOnMap = (path) => {
    return path.map((city) => {
      const marker = markers.find((marker) => marker.popUp === city);
      return marker ? marker.geocode : null;
    }).filter(Boolean);
  };

  return (
    <div className='map-component'>
      <div className="map-component-2">
        <div>
          <h2>Route Planner</h2>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="source" style={{ display: "block", marginBottom: "5px" }}>
              Source:
            </label>
            <input
              type="text"
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter source location"
              className="form-control"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="destination" style={{ display: "block", marginBottom: "5px" }}>
              Destination:
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination location"
              className="form-control"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <button
            onClick={fetchShortestPaths}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Find Paths
          </button>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>Results</h3>
          <div
            style={{
              height: "200px",
              overflowY: "auto",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "10px",
            }}
          >
            {loading ? (
  "Loading..."
) : topPaths.length > 0 ? (
  topPaths.map((pathObj, index) => (
    <div key={index} style={{ marginBottom: "10px" }}>
      <button
        onClick={() => finalizePath(pathObj.path)}
        style={{
          marginTop: "5px",
          padding: "5px 10px",
          backgroundColor: "#28a745", // Dark green background
          color: "#fff", // White text
          border: "2px solid #1e7b34", // Solid dark green border
          borderRadius: "4px",
          cursor: "pointer",
          textAlign: "center", // Ensures text inside button is left-aligned
          display: "block", // Makes buttons block elements to ensure alignment
        }}
      >
        {pathObj.path.join(" → ")}
        <strong>Distance:</strong> {pathObj.distance} 
      </button>
      
    </div>
  ))
) : (
  "No paths found."
)}

          </div>
        </div>
      </div>

      <div style={{ flex: 2 }}>
        <MapContainer
          center={[20.588, 78.3829]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {markers.map((marker, index) => (
  <Marker
    key={index}
    position={marker.geocode}
    icon={
      marker.popUp === source
        ? sourceIcon // Blue for Source
        : marker.popUp === destination
        ? destinationIcon // Green for Destination
        : customIcon // Default for others
    }
  >
    <Popup>{marker.popUp}</Popup>
    <Tooltip>{marker.popUp}</Tooltip>
  </Marker>
))}

          {topPaths.map((pathObj, index) => (
            <Polyline
              key={index}
              positions={renderPathOnMap(pathObj.path)}
              color={index === 0 ? "green" : index === 1 ? "blue" : "red"}
              weight={4}
              opacity={0.7}
              dashArray="10, 10"
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
