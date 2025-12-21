// src/components/Admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      const result = await adminAPI.deleteUser(userId);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'User deleted successfully' });
        fetchUsers();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete user' });
    }
  };

  const handleUpdateRole = async () => {
    try {
      const result = await adminAPI.updateUserRole(selectedUser._id, newRole);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'User role updated successfully' });
        setShowRoleModal(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update role' });
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="admin-content-header">
        <h2>User Management</h2>
        <p>Manage all users in the system</p>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{users.filter(u => u.role === 'admin').length}</h3>
            <p>Administrators</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{users.filter(u => u.role === 'user').length}</h3>
            <p>Regular Users</p>
          </div>
        </div>
      </div>

      <div className="card users-table-card">
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-cell-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-icon-edit"
                        onClick={() => openRoleModal(user)}
                        title="Change Role"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <button
                        className="btn-icon btn-icon-delete"
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        title="Delete User"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change User Role</h3>
              <button className="modal-close" onClick={() => setShowRoleModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Change role for <strong>{selectedUser?.name}</strong></p>
              <div className="form-group">
                <label className="form-label">Select New Role</label>
                <select
                  className="form-select"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handleUpdateRole}
              >
                Update Role
              </button>
              <button
                className="btn"
                style={{ backgroundColor: 'var(--gray-200)' }}
                onClick={() => setShowRoleModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;