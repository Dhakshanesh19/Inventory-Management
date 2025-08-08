// src/App.jsx
// This file sets up the overall structure of your application,
// including the router and the authentication context provider.
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CustomerProvider } from './context/CustomerContext';
import AppRoutes from './Routes.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CustomerProvider>
            <AppRoutes />
          </CustomerProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
