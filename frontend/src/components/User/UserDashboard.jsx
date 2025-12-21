// src/components/User/UserDashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Profile from './Profile';
import Questions from './Questions';
import MyQuestions from './MyQuestions';
import './UserDashboard.css';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'questions':
        return <Questions />;
      case 'my-questions':
        return <MyQuestions />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h3>{user?.name}</h3>
          <p className="user-email">{user?.email}</p>
          <span className="user-badge">User</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Profile</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>All Questions</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'my-questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-questions')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round"/>
              <polyline points="14 2 14 8 20 8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>My Questions</span>
          </button>
        </nav>

        <button className="logout-btn" onClick={logout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserDashboard;