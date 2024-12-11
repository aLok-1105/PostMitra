  require('dotenv').config();
  const express = require('express');
  const connectDB = require('./config/db');
  const authRoutes = require('./routes/authRoutes'); 
  const parcelRoutes = require('./routes/parcelRoutes'); 
  const cookieParser = require('cookie-parser');
  const cors = require('cors');

  const app = express();
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: 'http://172.16.58.87:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true // Required for cookies
  }));

  // Connect to the database
  connectDB();

  // Use the authentication routes
  app.use('/auth', authRoutes);  // All routes in authRoutes.js will be prefixed with /auth
  app.use('/parcel', parcelRoutes);

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
