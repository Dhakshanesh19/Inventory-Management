// server/seedProducts.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Supplier = require('./models/Supplier');
const Customer = require('./models/Customer');
require('dotenv').config();

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create sample suppliers
    const supplier1 = new Supplier({
      name: 'Tech Supplies Inc.',
      contactPerson: 'John Smith',
      phone: '+1-555-0123',
      email: 'john@techsupplies.com',
      address: '123 Tech Street, Silicon Valley, CA'
    });

    const supplier2 = new Supplier({
      name: 'Office Depot',
      contactPerson: 'Jane Doe',
      phone: '+1-555-0456',
      email: 'jane@officedepot.com',
      address: '456 Office Ave, Business District, NY'
    });

    await supplier1.save();
    await supplier2.save();
    console.log('Suppliers created successfully');

    // Create sample products
    const products = [
      {
        name: 'Laptop Dell XPS 13',
        sku: 'LAP-DELL-XPS13',
        description: '13-inch premium laptop with Intel i7 processor',
        quantity: 15,
        price: 1299.99,
        reorderLevel: 5,
        supplier: supplier1._id
      },
      {
        name: 'Wireless Mouse Logitech MX Master',
        sku: 'MOU-LOG-MXMASTER',
        description: 'Premium wireless mouse with ergonomic design',
        quantity: 3,
        price: 79.99,
        reorderLevel: 10,
        supplier: supplier1._id
      },
      {
        name: 'Mechanical Keyboard Cherry MX',
        sku: 'KEY-CHERRY-MX',
        description: 'Mechanical keyboard with Cherry MX Blue switches',
        quantity: 8,
        price: 149.99,
        reorderLevel: 5,
        supplier: supplier1._id
      },
      {
        name: 'Office Chair Ergonomic',
        sku: 'CHAIR-ERG-001',
        description: 'Ergonomic office chair with lumbar support',
        quantity: 2,
        price: 299.99,
        reorderLevel: 3,
        supplier: supplier2._id
      },
      {
        name: 'Desk Lamp LED',
        sku: 'LAMP-LED-001',
        description: 'Adjustable LED desk lamp with touch controls',
        quantity: 12,
        price: 45.99,
        reorderLevel: 8,
        supplier: supplier2._id
      }
    ];

    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
    }

    console.log('Products created successfully');

    // Create sample customers
    const customers = [
      {
        name: 'ABC Corporation',
        email: 'purchases@abccorp.com',
        phone: '+1-555-0789',
        address: '789 Corporate Blvd, Downtown, TX'
      },
      {
        name: 'XYZ Startup',
        email: 'orders@xyzstartup.com',
        phone: '+1-555-0321',
        address: '321 Innovation Drive, Tech Park, CA'
      }
    ];

    for (const customerData of customers) {
      const customer = new Customer(customerData);
      await customer.save();
    }

    console.log('Customers created successfully');
    console.log('Sample data seeded successfully!');

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedProducts();
