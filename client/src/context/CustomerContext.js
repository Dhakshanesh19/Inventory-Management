import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api/api';

const CustomerContext = createContext();

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData) => {
    setLoading(true);
    setError(null);
    try {
      const newCustomer = await createCustomer(customerData);
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (err) {
      setError(err.message || 'Failed to create customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editCustomer = async (id, customerData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCustomer = await updateCustomer(id, customerData);
      setCustomers(prev => 
        prev.map(customer => 
          customer._id === id ? updatedCustomer : customer
        )
      );
      return updatedCustomer;
    } catch (err) {
      setError(err.message || 'Failed to update customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeCustomer = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCustomer(id);
      setCustomers(prev => prev.filter(customer => customer._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const value = {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    editCustomer,
    removeCustomer,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};
