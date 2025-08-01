// server/controllers/supplierController.js
const Supplier = require('../models/Supplier');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private (All authenticated users)
const getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find({});
  res.json(suppliers);
};

// @desc    Create a new supplier
// @route   POST /api/suppliers
// @access  Private (Admin, Purchase Staff)
const createSupplier = async (req, res) => {
  const { name, contactPerson, phone, email, address } = req.body;
  const newSupplier = new Supplier({ name, contactPerson, phone, email, address });
  const createdSupplier = await newSupplier.save();
  res.status(201).json(createdSupplier);
};

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private (Admin, Purchase Staff)
const updateSupplier = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    supplier.name = req.body.name || supplier.name;
    supplier.contactPerson = req.body.contactPerson || supplier.contactPerson;
    supplier.phone = req.body.phone || supplier.phone;
    supplier.email = req.body.email || supplier.email;
    supplier.address = req.body.address || supplier.address;

    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } else {
    res.status(404).json({ message: 'Supplier not found' });
  }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private (Admin)
const deleteSupplier = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    await supplier.deleteOne();
    res.json({ message: 'Supplier removed' });
  } else {
    res.status(404).json({ message: 'Supplier not found' });
  }
};

module.exports = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};