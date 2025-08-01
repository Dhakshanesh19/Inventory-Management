// server/controllers/customerController.js
const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private (All authenticated users)
const getCustomers = async (req, res) => {
  const customers = await Customer.find({});
  res.json(customers);
};

// @desc    Get a single customer by ID
// @route   GET /api/customers/:id
// @access  Private (All authenticated users)
const getCustomerById = async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    res.json(customer);
  } else {
    res.status(404).json({ message: 'Customer not found' });
  }
};

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private (Admin, Sales Staff)
const createCustomer = async (req, res) => {
  const { name, email, phone, address } = req.body;
  const newCustomer = new Customer({ name, email, phone, address });
  const createdCustomer = await newCustomer.save();
  res.status(201).json(createdCustomer);
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private (Admin, Sales Staff)
const updateCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    customer.name = req.body.name || customer.name;
    customer.email = req.body.email || customer.email;
    customer.phone = req.body.phone || customer.phone;
    customer.address = req.body.address || customer.address;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } else {
    res.status(404).json({ message: 'Customer not found' });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin)
const deleteCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    await customer.deleteOne();
    res.json({ message: 'Customer removed' });
  } else {
    res.status(404).json({ message: 'Customer not found' });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};