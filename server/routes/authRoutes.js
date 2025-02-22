const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const router = express.Router();  // Create a new router

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Error: Email already in use');
    }

    if (!['Operator', 'Officer'].includes(role)) {
      return res.status(400).send('Invalid role. Allowed roles: Operator, Officer');
    }

    const newUser = new User({ email, password, role });
    await newUser.save();

    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Login route
router.post('/login', async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password, role } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).send('User not found');

    const isValid = await user.comparePassword(password);
    if (!isValid || user.role !== role) return res.status(401).send('Invalid credentials');

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    res.cookie('token', token, {
      httpOnly: true, // Can't be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 3600000, // 1 hour
      sameSite: 'strict', // Helps prevent CSRF attacks
  });

    res.status(200).json({ token, role: user.role, email: user.email});
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

module.exports = router;
