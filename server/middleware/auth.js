const jwt = require('jsonwebtoken');
const config = require('../config/config');

const checkRole = (roles) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).send('Access denied');

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (!roles.includes(decoded.role)) {
      return res.status(403).send('Access denied');
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

module.exports = checkRole;
