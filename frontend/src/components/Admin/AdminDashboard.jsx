// src/components/Admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserManagement from './UserManagement';
import QuestionManagement from './QuestionManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { user, logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'questions':
        return <QuestionManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h3>{user?.name}</h3>
          <p className="admin-email">{user?.email}</p>
          <span className="admin-badge">Administrator</span>
        </div>

        <nav className="admin-sidebar-nav">
          <button
            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>User Management</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Question Management</span>
          </button>
        </nav>

        <button className="admin-logout-btn" onClick={logout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>

      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;