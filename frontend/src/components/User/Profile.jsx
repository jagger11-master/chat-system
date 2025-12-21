// src/components/User/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const result = await userAPI.updateProfile(formData);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      const result = await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="content-header">
        <h2>Profile Settings</h2>
        <p>Manage your account information</p>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      <div className="profile-sections">
        {/* Profile Information */}
        <div className="card profile-card">
          <div className="card-header">
            <h3>Personal Information</h3>
            {!isEditing && (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="profile-info">
              <div className="info-row">
                <label>Full Name</label>
                <p>{user?.name}</p>
              </div>
              <div className="info-row">
                <label>Email Address</label>
                <p>{user?.email}</p>
              </div>
              <div className="info-row">
                <label>Account Type</label>
                <p className="role-badge">{user?.role}</p>
              </div>
            </div>
          ) : (
            <div className="profile-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user?.name || '', email: user?.email || '' });
                  }}
                  style={{ backgroundColor: 'var(--gray-200)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="card profile-card">
          <div className="card-header">
            <h3>Change Password</h3>
            {!isChangingPassword && (
              <button
                className="btn btn-secondary"
                onClick={() => setIsChangingPassword(true)}
              >
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword && (
            <div className="profile-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  {loading ? 'Changing...' : 'Update Password'}
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  style={{ backgroundColor: 'var(--gray-200)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;