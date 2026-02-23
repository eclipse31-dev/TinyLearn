import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Compute first name safely
  const firstName = useMemo(() => {
    if (!user) return '';
    return user.FName || user.username || '';
  }, [user]);

  // Avatar letter
  const avatarLetter = useMemo(() => {
    if (user?.FName) return user.FName.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return '?';
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
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

          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search..." 
            />
          </div>
        </div>

        <div className="navbar-right">
          <div className="user-menu" ref={dropdownRef}>
            <button 
              className="user-avatar-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              {avatarLetter}
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown active">
                <div className="dropdown-user-info">
                  <strong>{user.FName} {user.LName}</strong>
                  <small>@{user.username}</small>
                  <small>{user.email}</small>
                </div>

                <Link to="/settings" className="dropdown-item">
                  Profile Settings
                </Link>

                <button onClick={handleLogout} className="dropdown-item logout">
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