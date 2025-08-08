import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="main-header">
      <div className="header-brand">
        <Link to="/" className="brand-link">
          Inventory App
        </Link>
      </div>
      <nav className="header-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <span className="user-info">Welcome, {user?.name || 'User'}</span>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link nav-btn">Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
