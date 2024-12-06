const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const router = express.Router();  // Create a new router

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!['Operator', 'Officer'].includes(role)) {
      return res.status(400).send('Invalid role. Allowed roles: Operator, Officer');
    }

    const newUser = new User({ username, password, role });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');

    const isValid = await user.comparePassword(password);
    if (!isValid) return res.status(401).send('Invalid credentials');

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

module.exports = router;  // Ensure you export the router
