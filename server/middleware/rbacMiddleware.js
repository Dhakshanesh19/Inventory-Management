// server/middleware/rbacMiddleware.js
const authorize = (roles = []) => {
    // roles param can be a single role string (e.g. 'Admin') or an array of roles (e.g. ['Admin', 'Manager'])
    if (typeof roles === 'string') {
      roles = [roles];
    }
  
    return (req, res, next) => {
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'Not authorized, user role not found' });
      }
  
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
      }
  
      // authentication and authorization successful
      next();
    };
  };
  
  module.exports = authorize;