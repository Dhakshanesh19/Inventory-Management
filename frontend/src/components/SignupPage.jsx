import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_API_URL;

  const signup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/auth/signup`, formData, {
        withCredentials: true  // Optional, if backend uses cookies
      });
      alert('Signup successful! Please login.');
      navigate('/');  // Redirect to login page
    } catch (err) {
      alert('Signup failed. Try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={signup} className="signup-form">
      <h2>Signup</h2>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        required
      />
      <button type="submit">Signup</button>
      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </form>
  );
};

export default SignupPage;
