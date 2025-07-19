import React from 'react';
import axios from 'axios';
import './ItemList.css';

const ItemList = ({ items, fetchItems, setEditItem }) => {
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      fetchItems();
    } catch (error) {
      alert('Delete failed.');
    }
  };

  return (
    <div className="item-list">
      <h2>Inventory Items</h2>
      {items.length === 0 && <p>No items found.</p>}

      {items.map((item) => (
        <div key={item._id} className="item-card">
          <p>
            <strong>{item.name}</strong> (Qty: {item.quantity}) – ₹{item.price}
            <br />
            {item.description}
          </p>
          <div className="button-group">
            <button className="edit-btn" onClick={() => setEditItem(item)}>
              Edit
            </button>
            <button className="delete-btn" onClick={() => deleteItem(item._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
