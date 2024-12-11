const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// const checkRole = (roles) => (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(403).send('Access denied');

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, config.jwtSecret);
//     if (!roles.includes(decoded.role)) {
//       return res.status(403).send('Access denied');
//     }
//     req.user = decoded;
//     console.log(decoded.role);
    
//     // return decoded.role;
//     next();
//   } catch (err) {
//     res.status(401).send('Invalid token');
//   }
// };

const authenticate = async (req, res, next) => {
  try {
      // console.log("Authenticating token...");

      // Retrieve the token
      
      const token = 
          req.cookies.token || 
          (req.headers.authorization && req.headers.authorization.split(' ')[1]);

      if (!token) {
          return res.status(401).json({ message: "Unauthorized: Token not provided" });
      }

      // Verify the token
      const decoded = jwt.verify(token, config.jwtSecret);
      // console.log(decoded);
      
      if (!decoded.id) {
          return res.status(401).json({ message: "Invalid token: Missing user ID" });
      }

      // Check if user exists
      const sho =  await User.findById(decoded.id);
      if (!sho) {
          return res.status(404).json({ message: "SHO not found" });
      }

      // Attach user information to request
      req.user = {
          id: sho._id,
          email: sho.email,
      };

      next();
  } catch (error) {
      console.error("Authentication error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
  }
};


module.exports = authenticate;
