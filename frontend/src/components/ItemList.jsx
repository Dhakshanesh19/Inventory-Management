import React from 'react';
import axios from 'axios';
import './ItemList.css';

const ItemList = ({ items, fetchItems, setEditItem }) => {
  const backendUrl = process.env.REACT_APP_API_URL;

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/items/${id}`, {
        headers: { Authorization: localStorage.getItem('token') },
        withCredentials: true  // Optional, only if backend uses cookies
      });
      fetchItems();
    } catch (error) {
      alert('Delete failed.');
      console.error(error);
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
