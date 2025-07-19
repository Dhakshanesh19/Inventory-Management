import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditItem.css';

const EditItem = ({ editItem, fetchItems, clearEdit }) => {
  const [item, setItem] = useState(editItem);

  useEffect(() => {
    setItem(editItem);
  }, [editItem]);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/items/${item._id}`, item, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      fetchItems();
      clearEdit();
    } catch (error) {
      alert('Update failed.');
    }
  };

  if (!editItem) return null;

  return (
    <form onSubmit={handleSubmit} className="edit-item-form">
      <h3>Edit Item</h3>
      <input
        name="name"
        value={item.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        name="quantity"
        value={item.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        required
      />
      <input
        name="price"
        value={item.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <input
        name="description"
        value={item.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <button type="submit">Update Item</button>
      <button type="button" onClick={clearEdit} className="cancel-btn">
        Cancel
      </button>
    </form>
  );
};

export default EditItem;
