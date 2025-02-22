const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const parcelRoutes = require("./routes/parcelRoutes");
const graphRoutes = require("./routes/graphRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { WebSocketServer } = require('ws');
const { createServer } = require('http');
const handleConnection = require('./wsHandler');

connectDB();
const app = express();
const server = createServer(app);
const wsServer = new WebSocketServer({ server });

wsServer.on('connection', handleConnection);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

//Routes
app.use("/auth", authRoutes);
app.use("/parcel", parcelRoutes);
app.use("/api/graph", graphRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

wsServer.on("connection", (ws) => {
  console.log("New client connected");

  ws.send("Welcome to WebSocket Server!");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
