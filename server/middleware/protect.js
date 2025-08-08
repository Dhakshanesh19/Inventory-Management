// server/middleware/protect.js
const User = require('../models/User');

const protect = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      req.user = user; // attach user for `getMe`
      next();
    } catch (err) {
      console.error('Protect middleware error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no session' });
  }
};

module.exports = protect;
