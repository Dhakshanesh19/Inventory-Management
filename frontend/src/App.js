import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import AddItem from './components/AddItem';
import ItemList from './components/ItemList';
import EditItem from './components/EditItem';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import './InventoryPage.css'
const InventoryPage = ({ token, setToken }) => {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const fetchItems = useCallback(async () => {
    const res = await axios.get('http://localhost:5000/api/items', {
      headers: { Authorization: token }
    });
    setItems(res.data);
  }, [token]);

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
};   // ✅ Properly closed InventoryPage component

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setToken={setToken} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/inventory" element={<InventoryPage token={token} setToken={setToken} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
