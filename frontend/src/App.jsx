import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import AddItem from './components/AddItem';
import ItemList from './components/ItemList';
import EditItem from './components/EditItem';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import './InventoryPage.css';

const InventoryPage = ({ token, setToken }) => {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const backendUrl = process.env.REACT_APP_API_URL;

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/items`, {
        headers: { Authorization: token },
        withCredentials: true,  // Optional, if backend uses cookies
      });
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    }
  }, [token, backendUrl]);

  useEffect(() => {
    if (token) fetchItems();
  }, [token, fetchItems]);

  if (!token) return <Navigate to="/" />;

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem('token');
            setToken(null);
          }}
        >
          Logout
        </button>
      </div>

      <div className="inventory-section">
        <AddItem fetchItems={fetchItems} />
        <ItemList items={items} fetchItems={fetchItems} setEditItem={setEditItem} />
        {editItem && (
          <EditItem
            editItem={editItem}
            fetchItems={fetchItems}
            clearEdit={() => setEditItem(null)}
          />
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setToken={setToken} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/inventory" element={<InventoryPage token={token} setToken={setToken} />} />
      </Routes>
    </Router>
  );
};

export default App;
