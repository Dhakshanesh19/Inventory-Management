import React, { useState, useEffect } from 'react';
import Alert from '../common/Alert';
import Modal from '../common/Modal';
import { createProduct, updateProduct, getCategories, getSuppliers, getWarehouses } from '../../api/api';

const ProductForm = ({ productData = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: productData?.name || '',
    sku: productData?.sku || '',
    barcode: productData?.barcode || '',
    qrCode: productData?.qrCode || '',
    category: productData?.category || '',
    supplier: productData?.supplier || '',
    description: productData?.description || '',
    quantity: productData?.quantity || 0,
    price: productData?.price || 0,
    costPrice: productData?.costPrice || 0,
    reorderLevel: productData?.reorderLevel || 10,
    reorderQuantity: productData?.reorderQuantity || 50,
    uom: productData?.uom || 'pieces',
    isActive: productData?.isActive !== false,
    isPerishable: productData?.isPerishable || false,
    requiresSerialNumber: productData?.requiresSerialNumber || false,
    requiresBatchTracking: productData?.requiresBatchTracking || false,
    costingMethod: productData?.costingMethod || 'WeightedAverage',
    tags: productData?.tags || [],
    specifications: {
      weight: productData?.specifications?.weight || '',
      dimensions: {
        length: productData?.specifications?.dimensions?.length || '',
        width: productData?.specifications?.dimensions?.width || '',
        height: productData?.specifications?.dimensions?.height || ''
      },
      color: productData?.specifications?.color || '',
      material: productData?.specifications?.material || '',
      brand: productData?.specifications?.brand || '',
      model: productData?.specifications?.model || ''
    }
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState('');

  const isEditing = !!productData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, suppliersData, warehousesData] = await Promise.all([
          getCategories(),
          getSuppliers(),
          getWarehouses()
        ]);
        setCategories(categoriesData);
        setSuppliers(suppliersData);
        setWarehouses(warehousesData);
      } catch (err) {
        console.error('Error fetching form data:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSpecificationChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        [field]: value
      }
    }));
  };

  const handleDimensionChange = (dimension, value) => {
    setFormData(prevData => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        dimensions: {
          ...prevData.specifications.dimensions,
          [dimension]: value
        }
      }
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prevData => ({
        ...prevData,
        tags: [...prevData.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prevData => ({
      ...prevData,
      tags: prevData.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic form validation
    if (!formData.name || !formData.sku) {
      setError('Name and SKU are required.');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await updateProduct(productData._id, formData);
      } else {
        await createProduct(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error('Product form submission error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSKU = () => {
    const prefix = formData.name.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    setFormData(prevData => ({
      ...prevData,
      sku: `${prefix}-${timestamp}`
    }));
  };

  const generateBarcode = () => {
    const barcode = '1234567890123'; // In real app, use a proper barcode generator
    setFormData(prevData => ({
      ...prevData,
      barcode: barcode
    }));
  };

  return (
    <Modal show={true} title={isEditing ? 'Edit Product' : 'Add New Product'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="form-container">
        {error && <Alert type="error" message={error} />}
        
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sku">SKU *</label>
              <div className="input-group">
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  className="form-input"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="btn btn-secondary" onClick={generateSKU}>
                  Generate
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="barcode">Barcode</label>
              <div className="input-group">
                <input
                  type="text"
                  id="barcode"
                  name="barcode"
                  className="form-input"
                  value={formData.barcode}
                  onChange={handleChange}
                />
                <button type="button" className="btn btn-secondary" onClick={generateBarcode}>
                  Generate
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="qrCode">QR Code</label>
              <input
                type="text"
                id="qrCode"
                name="qrCode"
                className="form-input"
                value={formData.qrCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-input"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="form-section">
          <h3>Pricing & Inventory</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Selling Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="costPrice">Cost Price *</label>
              <input
                type="number"
                id="costPrice"
                name="costPrice"
                className="form-input"
                value={formData.costPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Initial Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="form-input"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="uom">Unit of Measure</label>
              <select
                id="uom"
                name="uom"
                className="form-input"
                value={formData.uom}
                onChange={handleChange}
              >
                <option value="pieces">Pieces</option>
                <option value="kilograms">Kilograms</option>
                <option value="liters">Liters</option>
                <option value="meters">Meters</option>
                <option value="boxes">Boxes</option>
                <option value="pairs">Pairs</option>
                <option value="sets">Sets</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reorderLevel">Reorder Level</label>
              <input
                type="number"
                id="reorderLevel"
                name="reorderLevel"
                className="form-input"
                value={formData.reorderLevel}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="reorderQuantity">Reorder Quantity</label>
              <input
                type="number"
                id="reorderQuantity"
                name="reorderQuantity"
                className="form-input"
                value={formData.reorderQuantity}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Categories & Suppliers */}
        <div className="form-section">
          <h3>Categories & Suppliers</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="supplier">Supplier</label>
              <select
                id="supplier"
                name="supplier"
                className="form-input"
                value={formData.supplier}
                onChange={handleChange}
              >
                <option value="">Select Supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="form-section">
          <h3>Product Specifications</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                className="form-input"
                value={formData.specifications.brand}
                onChange={(e) => handleSpecificationChange('brand', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input
                type="text"
                id="model"
                className="form-input"
                value={formData.specifications.model}
                onChange={(e) => handleSpecificationChange('model', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="color">Color</label>
              <input
                type="text"
                id="color"
                className="form-input"
                value={formData.specifications.color}
                onChange={(e) => handleSpecificationChange('color', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="material">Material</label>
              <input
                type="text"
                id="material"
                className="form-input"
                value={formData.specifications.material}
                onChange={(e) => handleSpecificationChange('material', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                className="form-input"
                value={formData.specifications.weight}
                onChange={(e) => handleSpecificationChange('weight', e.target.value)}
                step="0.01"
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="costingMethod">Costing Method</label>
              <select
                id="costingMethod"
                name="costingMethod"
                className="form-input"
                value={formData.costingMethod}
                onChange={handleChange}
              >
                <option value="WeightedAverage">Weighted Average</option>
                <option value="FIFO">FIFO</option>
                <option value="LIFO">LIFO</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="length">Length (cm)</label>
              <input
                type="number"
                id="length"
                className="form-input"
                value={formData.specifications.dimensions.length}
                onChange={(e) => handleDimensionChange('length', e.target.value)}
                step="0.1"
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="width">Width (cm)</label>
              <input
                type="number"
                id="width"
                className="form-input"
                value={formData.specifications.dimensions.width}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                step="0.1"
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                className="form-input"
                value={formData.specifications.dimensions.height}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                step="0.1"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Product Settings */}
        <div className="form-section">
          <h3>Product Settings</h3>
          <div className="form-row">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active Product
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isPerishable"
                  checked={formData.isPerishable}
                  onChange={handleChange}
                />
                Perishable Item
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="requiresSerialNumber"
                  checked={formData.requiresSerialNumber}
                  onChange={handleChange}
                />
                Requires Serial Number
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="requiresBatchTracking"
                  checked={formData.requiresBatchTracking}
                  onChange={handleChange}
                />
                Requires Batch Tracking
              </label>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="form-section">
          <h3>Tags</h3>
          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                className="form-input"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddTag}>
                Add
              </button>
            </div>
          </div>
          {formData.tags.length > 0 && (
            <div className="tags-container">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Product')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;
