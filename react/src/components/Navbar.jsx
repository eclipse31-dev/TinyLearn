import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import NotificationsCenter from './NotificationsCenter';
import OnlineUsers from './OnlineUsers';
import ThemeToggle from './ThemeToggle';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  const firstName = useMemo(() => {
    if (!user) return '';
    return user.FName || user.username || '';
  }, [user]);

  const avatarLetter = useMemo(() => {
    if (user?.FName) return user.FName.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return '?';
  }, [user]);

  const avatarImage = useMemo(() => {
    // Prefer Google avatar if available
    if (user?.google_avatar) return user.google_avatar;
    if (user?.avatar) return user.avatar;
    return null;
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-greeting">
            Hi <span className="navbar-greeting-name">{firstName},</span>
          </div>
        </div>

        <div className="navbar-right">
          <OnlineUsers />
          <ThemeToggle />
          <NotificationsCenter />
          
          <div className="user-menu" ref={dropdownRef}>
            <button 
              className="user-avatar-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              title={`${user.FName} ${user.LName}`}
            >
              {avatarImage && !imageError ? (
                <img 
                  src={avatarImage} 
                  alt={`${user.FName} ${user.LName}`}
                  className="user-avatar-image"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="user-avatar-letter">{avatarLetter}</span>
              )}
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown active">
                <div className="dropdown-user-info">
                  <strong>{user.FName} {user.LName}</strong>
                  <small>@{user.username}</small>
                  <small>{user.email}</small>
                </div>

                <Link to="/settings" className="dropdown-item">
                  <Settings size={16} style={{ marginRight: '8px', color: '#ec4899' }} />
                  Profile Settings
                </Link>

                <button onClick={handleLogout} className="dropdown-item logout">
                  <LogOut size={16} style={{ marginRight: '8px', color: '#ec4899' }} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}