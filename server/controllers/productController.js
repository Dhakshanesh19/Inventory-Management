// server/controllers/productController.js
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Private (Admin, Inventory Manager)
const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Private (All authenticated users)
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin, Inventory Manager)
const createProduct = async (req, res) => {
  const { name, sku, category, supplier, description, quantity, price, reorderLevel } = req.body;
  
  try {
    const product = new Product({
      name,
      sku,
      category,
      supplier,
      description,
      quantity,
      price,
      reorderLevel,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin, Inventory Manager)
const updateProduct = async (req, res) => {
  const { name, sku, category, supplier, description, quantity, price, reorderLevel } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.sku = sku || product.sku;
    product.category = category || product.category;
    product.supplier = supplier || product.supplier;
    product.description = description || product.description;
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    product.price = price !== undefined ? price : product.price;
    product.reorderLevel = reorderLevel !== undefined ? reorderLevel : product.reorderLevel;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private (All authenticated users)
const getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    });
    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching low stock products', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin, Inventory Manager)
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};


// @desc    Get products expiring soon
// @route   GET /api/products/expiring
// @access  Private (All authenticated users)
const getExpiringProducts = async (req, res) => {
  try {
    const today = new Date();
    const soon = new Date();
    soon.setDate(today.getDate() + 30); // next 30 days

    // Adjust "expiryDate" to match your actual field name in Product model
    const expiringProducts = await Product.find({
      expiryDate: { $gte: today, $lte: soon }
    });

    res.json(expiringProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expiring products', error: error.message });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getExpiringProducts // make sure it's exported here

};