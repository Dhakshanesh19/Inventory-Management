import React from 'react';

const ProductCard = ({ product, onEdit }) => {
  return (
    <div className="product-card">
      <div className="card-image-container">
        {/* Placeholder for a product image */}
        <img 
          src={`https://placehold.co/150x150/E5E7EB/4B5563?text=${product.name}`} 
          alt={product.name} 
          className="product-image"
        />
      </div>
      <div className="card-content">
        <h4 className="card-title">{product.name}</h4>
        <p className="card-info">SKU: {product.sku}</p>
        <p className="card-info">Price: ${product.price}</p>
        <p className="card-info">In Stock: {product.currentStock}</p>
      </div>
      <div className="card-actions">
        <button onClick={() => onEdit(product)} className="btn btn-primary">Edit</button>
      </div>
    </div>
  );
};

export default ProductCard;
