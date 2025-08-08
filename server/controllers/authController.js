// server/controllers/authController.js
const User = require('../models/User');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password, role });

  if (user) {
    // On successful registration, create a session
    req.session.userId = user._id;

    res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'Success'
      });
      
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // On successful login, create a session
    req.session.userId = user._id;

    res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'Success'
      });
      
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again.' });
    }
    res.clearCookie('connect.sid'); // Clears the session cookie
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

const getMe = (req, res) => {
  // The 'protect' middleware has already attached the user object to the request
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: 'User not found in session' });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getMe };