import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import axios from 'axios';
import '../../styles/settings.css';

export default function SettingsPage() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile state
  const [profile, setProfile] = useState({
    FName: '',
    LName: '',
    email: '',
    username: '',
  });

  // Password state
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email_announcements: true,
    email_assignments: true,
    email_grades: true,
    push_announcements: true,
    push_assignments: true,
    push_grades: true,
  });

  // Appearance preferences
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'en',
    compact_mode: false,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        FName: user.FName || '',
        LName: user.LName || '',
        email: user.email || '',
        username: user.username || '',
      });
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/api/user/profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.new_password_confirmation) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/api/user/password', passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage('success', 'Password changed successfully!');
      setPasswords({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/api/user/notifications', notifications, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage('success', 'Notification preferences updated!');
    } catch (error) {
      showMessage('error', 'Failed to update preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAppearanceUpdate = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('theme', appearance.theme);
      localStorage.setItem('language', appearance.language);
      localStorage.setItem('compact_mode', appearance.compact_mode);
      showMessage('success', 'Appearance settings saved!');
    } catch (error) {
      showMessage('error', 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfileTab = () => (
    <div className="settings-section">
      <h2>Profile Information</h2>
      <p className="section-description">Update your account profile information</p>

      <form onSubmit={handleProfileUpdate} className="settings-form">
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={profile.FName}
              onChange={(e) => setProfile({ ...profile, FName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={profile.LName}
              onChange={(e) => setProfile({ ...profile, LName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="settings-section">
      <h2>Change Password</h2>
      <p className="section-description">Ensure your account is using a strong password</p>

      <form onSubmit={handlePasswordChange} className="settings-form">
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={passwords.current_password}
            onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={passwords.new_password}
            onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
            required
            minLength={8}
          />
          <small>Must be at least 8 characters</small>
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={passwords.new_password_confirmation}
            onChange={(e) => setPasswords({ ...passwords, new_password_confirmation: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isSaving}>
          {isSaving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-section">
      <h2>Notification Preferences</h2>
      <p className="section-description">Manage how you receive notifications</p>

      <div className="settings-form">
        <div className="notification-group">
          <h3>Email Notifications</h3>
          <div className="toggle-item">
            <div>
              <strong>Announcements</strong>
              <p>Receive emails when new announcements are posted</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.email_announcements}
                onChange={(e) => setNotifications({ ...notifications, email_announcements: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <strong>Assignments</strong>
              <p>Get notified about new assignments and deadlines</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.email_assignments}
                onChange={(e) => setNotifications({ ...notifications, email_assignments: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <strong>Grades</strong>
              <p>Receive emails when grades are posted</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.email_grades}
                onChange={(e) => setNotifications({ ...notifications, email_grades: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="notification-group">
          <h3>Push Notifications</h3>
          <div className="toggle-item">
            <div>
              <strong>Announcements</strong>
              <p>Show browser notifications for announcements</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.push_announcements}
                onChange={(e) => setNotifications({ ...notifications, push_announcements: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <strong>Assignments</strong>
              <p>Get push notifications for assignments</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.push_assignments}
                onChange={(e) => setNotifications({ ...notifications, push_assignments: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <strong>Grades</strong>
              <p>Show notifications when grades are available</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.push_grades}
                onChange={(e) => setNotifications({ ...notifications, push_grades: e.target.checked })}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <button onClick={handleNotificationUpdate} className="btn-primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="settings-section">
      <h2>Appearance</h2>
      <p className="section-description">Customize how the application looks</p>

      <div className="settings-form">
        <div className="form-group">
          <label>Theme</label>
          <select
            value={appearance.theme}
            onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Language</label>
          <select
            value={appearance.language}
            onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <div className="toggle-item">
          <div>
            <strong>Compact Mode</strong>
            <p>Reduce spacing for a more compact interface</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={appearance.compact_mode}
              onChange={(e) => setAppearance({ ...appearance, compact_mode: e.target.checked })}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <button onClick={handleAppearanceUpdate} className="btn-primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Appearance'}
        </button>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="settings-section">
      <h2>Account Management</h2>
      <p className="section-description">Manage your account data and settings</p>

      <div className="settings-form">
        <div className="account-action">
          <div>
            <h3>Export Your Data</h3>
            <p>Download a copy of your account data and activity</p>
          </div>
          <button className="btn-secondary">Export Data</button>
        </div>

        <div className="account-action danger-zone">
          <div>
            <h3>Delete Account</h3>
            <p>Permanently delete your account and all associated data</p>
          </div>
          <button className="btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="settings-page">
        <div className="page-header">
          <h1>Settings</h1>
          <p>Manage your profile and preferences</p>
        </div>

        {message.text && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="settings-container">
          <div className="settings-sidebar">
            <nav className="settings-nav">
              <button
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => setActiveTab('profile')}
              >
                <span className="icon">👤</span>
                Profile
              </button>
              <button
                className={activeTab === 'security' ? 'active' : ''}
                onClick={() => setActiveTab('security')}
              >
                <span className="icon">🔒</span>
                Security
              </button>
              <button
                className={activeTab === 'notifications' ? 'active' : ''}
                onClick={() => setActiveTab('notifications')}
              >
                <span className="icon">🔔</span>
                Notifications
              </button>
              <button
                className={activeTab === 'appearance' ? 'active' : ''}
                onClick={() => setActiveTab('appearance')}
              >
                <span className="icon">🎨</span>
                Appearance
              </button>
              <button
                className={activeTab === 'account' ? 'active' : ''}
                onClick={() => setActiveTab('account')}
              >
                <span className="icon">⚙️</span>
                Account
              </button>
            </nav>
          </div>

          <div className="settings-main">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'appearance' && renderAppearanceTab()}
            {activeTab === 'account' && renderAccountTab()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
