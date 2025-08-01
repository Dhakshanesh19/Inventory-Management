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

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};