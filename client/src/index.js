// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Your main CSS file for global styles
import App from './App'; // Your main App component

// Use createRoot from react-dom/client for modern React 18+ rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your App component inside the React strict mode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Note: If you're using a version of React older than 18, 
// you would use ReactDOM.render() instead.
