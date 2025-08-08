// server/seed.js
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@inventory.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create default admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@inventory.com',
      password: 'admin123',
      role: 'Admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@inventory.com');
    console.log('Password: admin123');

    // Create a test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@inventory.com',
      password: 'test123',
      role: 'Sales Staff'
    });

    await testUser.save();
    console.log('Test user created successfully');
    console.log('Email: test@inventory.com');
    console.log('Password: test123');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();
