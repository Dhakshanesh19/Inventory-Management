import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you use react-router-dom
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Alert from '../components/common/Alert';
import Table from '../components/common/Table';
import ProductVariantForm from '../components/products/ProductVariantForm';
// Assuming you have an API utility for product data
// import { getProductDetails } from '../../api/api'; 

const ProductDetailsPage = () => {
  const { productId } = useParams(); // Get product ID from URL params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      // Placeholder for an API call to get product details
      // const data = await getProductDetails(productId);
      const mockData = {
        _id: '1',
        name: 'Product A',
        sku: 'A-123',
        price: 19.99,
        description: 'A brief description of product A.',
        variants: [
          { _id: 'v1', variantName: 'Red', sku: 'A-123-R', price: 19.99, currentStock: 10 },
          { _id: 'v2', variantName: 'Blue', sku: 'A-123-B', price: 20.99, currentStock: 15 },
        ]
      };
      setProduct(mockData);
      setError(null);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError(err.message || 'Failed to fetch product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleAddVariant = () => {
    setSelectedVariant(null);
    setShowVariantModal(true);
  };

  const handleEditVariant = (variant) => {
    setSelectedVariant(variant);
    setShowVariantModal(true);
  };

  const handleCloseModal = () => {
    setShowVariantModal(false);
    setSelectedVariant(null);
  };

  const handleSaveVariant = () => {
    // Refresh the data after a successful save
    fetchProductDetails();
  };

  const variantColumns = [
    { header: 'Variant Name', accessor: 'variantName' },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Price', accessor: 'price' },
    { header: 'Current Stock', accessor: 'currentStock' },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button className="btn btn-secondary" onClick={() => handleEditVariant(row)}>
          Edit
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="app-layout">
        <Header />
        <Sidebar />
        <main className="content-area">
          <div className="loading-state">Loading product details...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <main className="content-area">
        <h2 className="page-heading">Product Details: {product?.name}</h2>
        
        <div className="product-details-summary card">
          <h4>Product Information</h4>
          <p><strong>SKU:</strong> {product?.sku}</p>
          <p><strong>Price:</strong> ${product?.price}</p>
          <p><strong>Description:</strong> {product?.description}</p>
        </div>

        <h3 className="section-heading">Product Variants</h3>
        <div className="action-bar">
          <button className="btn btn-primary" onClick={handleAddVariant}>
            Add New Variant
          </button>
        </div>

        {product?.variants.length > 0 ? (
          <Table columns={variantColumns} data={product?.variants} />
        ) : (
          <Alert type="info" message="No variants for this product." />
        )}

        {showVariantModal && (
          <ProductVariantForm
            product={product}
            variantData={selectedVariant}
            onClose={handleCloseModal}
            onSave={handleSaveVariant}
          />
        )}
      </main>
    </div>
  );
};

export default ProductDetailsPage;
