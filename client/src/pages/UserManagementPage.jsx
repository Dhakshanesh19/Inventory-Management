import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Alert from '../components/common/Alert';
import Table from '../components/common/Table';
// Assuming you have an API utility for user management
// import { getUsers, updateUserRole } from '../../api/api'; 

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Placeholder for an API call to get all users
      // const data = await getUsers();
      const mockData = [
          { _id: 'u-1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
          { _id: 'u-2', name: 'Regular User', email: 'user@example.com', role: 'user' },
      ];
      setUsers(mockData);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleRoleChange = async (userId, newRole) => {
    try {
      // Placeholder for an API call to update user role
      console.log(`Updating user ${userId} to role: ${newRole}`);
      // await updateUserRole(userId, { role: newRole });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err.message || 'Failed to update user role.');
    }
  };

  const columns = [
    { header: 'User Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Role', 
      accessor: 'role', 
      render: (row) => (
        <select 
          value={row.role} 
          onChange={(e) => handleRoleChange(row._id, e.target.value)}
          className="form-input-select"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      ) 
    },
  ];

  const dataWithRoleSelect = users.map(user => ({
    ...user,
    role: columns[2].render(user),
  }));

  if (loading) {
    return (
      <div className="app-layout">
        <Header />
        <Sidebar />
        <main className="content-area">
          <div className="loading-state">Loading users...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <main className="content-area">
        <h2 className="page-heading">User Management</h2>
        {error && <Alert type="error" message={error} />}

        {users.length > 0 ? (
          <Table columns={columns} data={dataWithRoleSelect} />
        ) : (
          <Alert type="info" message="No users found." />
        )}
      </main>
    </div>
  );
};

export default UserManagementPage;
