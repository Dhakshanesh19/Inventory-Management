// server/middleware/authMiddleware.js
const User = require('../models/User');

const protect = async (req, res, next) => {
  // Check if a user ID is stored in the session
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      console.error('Error fetching user from session:', error);
      req.session.destroy(); // Destroy session on error
      return res.status(401).json({ message: 'Not authorized, session failed' });
    }
  }

  // If no session or user not found, send unauthorized response
  res.status(401).json({ message: 'Not authorized, no active session' });
};

module.exports = protect;