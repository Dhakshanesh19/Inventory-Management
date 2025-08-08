// src/components/common/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Suppliers', path: '/suppliers' },
    { name: 'Customers', path: '/customers' },
    { name: 'Purchases', path: '/purchases' },
    { name: 'Sales', path: '/sales' },
    { name: 'Reports', path: '/reports' },
    { name: 'Users', path: '/users' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h2 className="sidebar-title">InventoryApp</h2>
        <nav>
          <ul className="sidebar-nav">
            {links.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
