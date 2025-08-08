// src/components/dashboard/TopProducts.jsx
import React from 'react';

const TopProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="top-products-container">
        <h3>Top Products (Low Stock)</h3>
        <div className="no-data">No products available</div>
      </div>
    );
  }

  return (
    <div className="top-products-container">
      <h3>Top Products (Low Stock)</h3>
      <div className="products-list">
        {products.map((product, index) => (
          <div key={product._id || index} className="product-item">
            <div className="product-info">
              <div className="product-name">{product.name}</div>
              <div className="product-details">
                <span className="stock-info">Stock: {product.quantity}</span>
                <span className="price-info">₹{product.price}</span>
              </div>
            </div>
            <div className={`stock-indicator ${product.quantity <= 5 ? 'low' : 'normal'}`}>
              {product.quantity <= 5 ? 'Low Stock' : 'In Stock'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
