// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Import mongoose for MongooseStore
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Configure and use express-session for secure server-side session management
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a secret key from the .env file
    resave: false, // Prevents session from being saved on every request
    saveUninitialized: false, // Prevents creating a session for unauthenticated users
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // Use your MongoDB connection string
      collectionName: 'sessions', // The collection where session data will be stored
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Session expires after 1 day
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      sameSite: 'strict', // Mitigates CSRF attacks
    },
  })
);

// Import all specified routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const customerRoutes = require('./routes/customerRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const salesRoutes = require('./routes/salesRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userManagementRoutes = require('./routes/userManagementRoutes');

// Use all specified routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userManagementRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
