const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
// This middleware checks for a JWT token in the Authorization header,
// verifies it, and attaches the user to the request object if valid.
// If the token is missing or invalid, it responds with a 401 Unauthorized status.
// This allows protected routes to access the authenticated user's information.
// Usage: Apply this middleware to routes that require authentication.
// Example: app.use('/api/protected', protect, protectedRouteHandler);
// This code defines an authentication middleware for an Express.js application.
// It checks for a JWT token in the request headers, verifies it, and attaches the user
// information to the request object if the token is valid. If the token is missing or invalid,
// it responds with a 401 Unauthorized status. This middleware is used to protect routes that require
// authentication, allowing access to the authenticated user's information.
// Usage: Apply this middleware to routes that require authentication.
