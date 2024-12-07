import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Icon } from "leaflet";

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
  ];

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [25, 25],
  });

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState([]);

  const handleSourceChange = (e) => setSource(e.target.value);
  const handleDestinationChange = (e) => setDestination(e.target.value);

  const handleButtonClick = () => {
    // Logic to calculate and display the route
    // For simplicity, you can use a basic example where the route connects the source and destination markers
    const sourceMarker = markers.find((marker) => marker.popUp === source);
    const destinationMarker = markers.find((marker) => marker.popUp === destination);

    if (sourceMarker && destinationMarker) {
      setRoute([sourceMarker.geocode, destinationMarker.geocode]);
    }
  };

  const coordinates = markers.map(marker => marker.geocode);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#f4f4f4",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
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
              onChange={handleSourceChange}
              placeholder="Enter source location"
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
              onChange={handleDestinationChange}
              placeholder="Enter destination location"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <button
            onClick={handleButtonClick}
            style={{
              padding: "10px 15px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Show Route
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
            {route.length > 0
              ? `Route: ${route[0]} -> ${route[1]}`
              : "No route selected."}
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
            minZoom={0}
            maxZoom={20}
            ext="png"
          />
          {markers.map((marker, index) => (
            <Marker key={index} position={marker.geocode} icon={customIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
          {route.length === 2 && (
            <Polyline
              positions={route}
              color="blue"
              weight={4}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;