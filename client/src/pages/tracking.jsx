import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";

export function Tracking() {
  const { parcelId } = useParams();
  const location = useLocation();
  const [inputParcelId, setInputParcelId] = useState(parcelId || "");
  const [filteredParcelId, setFilteredParcelId] = useState(parcelId || "");
  const WS_URL = `ws://127.0.0.1:8080?username=tracking`;
  const { lastJsonMessage } = useWebSocket(WS_URL, { share: true });
  const [trackingData, setTrackingData] = useState({});

  useEffect(() => {
    if (lastJsonMessage) {
      setTrackingData(lastJsonMessage.data);
    }
  }, [lastJsonMessage]);

  const handleFilterSubmit = () => {
    console.log(lastJsonMessage);
    console.log(trackingData);
    setFilteredParcelId(inputParcelId);
  };

  const filterByParcelId = (data, id) => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((item) => item.parcelId == id);
  };

  const filteredMessages = filterByParcelId(trackingData, filteredParcelId);

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        style={{
          fontSize: "40px",
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        Parcel Tracking
      </Typography>

      <Card style={{ maxWidth: "500px", margin: "0 auto", padding: "20px"}}>
        <CardContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontWeight:'bold'
            }}
          >
            <TextField
              label="Parcel ID"
              variant="outlined"
              value={inputParcelId}
              onChange={(e) => setInputParcelId(e.target.value)}
              style={{ width: "100%", marginBottom: "20px",  }}
            />
            <Button
              variant="contained"
              style={{ backgroundColor: "green", color: "white" }}
              onClick={handleFilterSubmit}
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredParcelId ? (
        filteredMessages.length > 0 ? (
          <div style={{ marginTop: "30px" }}>
            <Typography
              variant="h5"
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              Tracking for Parcel ID: {filteredParcelId}
            </Typography>
            <div
              style={{
                position: "relative",
                margin: "20px auto",
                paddingLeft: "20px",
                maxWidth: "600px",
              }}
            >
              {filteredMessages.map((update, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#ff5722",
                      borderRadius: "50%",
                      animation: "blink 1s infinite",
                      marginRight: "15px",
                    }}
                  ></div>
                  <div>
                    <Typography
                      style={{ margin: 0, fontWeight: "bold" }}
                      variant="body1"
                    >
                      {update.message}
                    </Typography>
                    <Typography
                      style={{ margin: 0, fontSize: "0.9em", color: "gray" }}
                      variant="caption"
                    >
                      {update.time}
                    </Typography>
                  </div>
                </div>
              ))}
              <style>
                {`
                  @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                  }
                `}
              </style>
            </div>
          </div>
        ) : (
          <Typography
            style={{ textAlign: "center", color: "red", marginTop: "20px" }}
          >
            No tracking data available for Parcel ID: {filteredParcelId}
          </Typography>
        )
      ) : (
        <Typography style={{ textAlign: "center", marginTop: "20px" }}>
          Enter a Parcel ID to view its tracking details.
        </Typography>
      )}
    </div>
  );
}