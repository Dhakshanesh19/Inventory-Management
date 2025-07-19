import React, { useState } from 'react';
import axios from 'axios';
import './AddItem.css';

const AddItem = ({ fetchItems }) => {
  const [item, setItem] = useState({
    name: '',
    quantity: '',
    price: '',
    description: ''
  });

  const backendUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/items`, item, {
        headers: { Authorization: localStorage.getItem('token') },
        withCredentials: true  // Optional, in case backend uses cookies
      });
      setItem({ name: '', quantity: '', price: '', description: '' });
      fetchItems();
    } catch (error) {
      alert('Failed to add item.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-item-form">
      <input
        name="name"
        placeholder="Name"
        value={item.name}
        onChange={handleChange}
        required
      />
      <input
        name="quantity"
        placeholder="Quantity"
        value={item.quantity}
        onChange={handleChange}
        required
      />
      <input
        name="price"
        placeholder="Price"
        value={item.price}
        onChange={handleChange}
        required
      />
      <input
        name="description"
        placeholder="Description"
        value={item.description}
        onChange={handleChange}
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItem;
  