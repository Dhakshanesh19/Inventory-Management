// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require('../controllers/authController');
const protect = require('../middleware/protect'); // ✅ session check middleware

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/current-user', protect, getMe); // ✅ check session, return user

module.exports = router;
