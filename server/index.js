require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Operator', 'Officer'], default: 'Operator' },
});

const User = mongoose.model('User', AdminSchema);

app.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!['Operator', 'Officer'].includes(role)) {
      return res.status(400).send('Invalid role. Allowed roles: Operator, Officer');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});


app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).send('Invalid credentials');

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role }, 
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

const checkRole = (roles) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).send('Access denied');

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!roles.includes(decoded.role)) {
      return res.status(403).send('Access denied');
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

app.get('/protected', checkRole(['Officer']), (req, res) => {
  res.send(`Hello ${req.user.username}, you have Officer access`);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
