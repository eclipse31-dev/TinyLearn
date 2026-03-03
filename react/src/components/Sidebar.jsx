import React, { useContext, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Courses', path: '/courses', icon: '📚' },
    { name: 'Resources', path: '/resources', icon: '📁' },
    { name: 'Discussion', path: '/discussion', icon: '💬' },
    { name: 'Schedules', path: '/schedules', icon: '📅' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleName = useMemo(() => {
    if (!user) return 'student';
    if (Array.isArray(user.roles) && user.roles.length > 0) {
      return user.roles[0]?.role?.toLowerCase() || 'student';
    }
    if (typeof user.roles === 'string') {
      return user.roles.toLowerCase();
    }
    return 'student';
  }, [user]);

  const roleColor = roleName === 'teacher' || roleName === 'admin' ? '#ec4899' : '#3b82f6';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-box" style={{ background: roleColor }}>
          {roleName === 'teacher' || roleName === 'admin' ? '👨‍🏫' : '👨‍🎓'}
        </div>
        <div className="brand-text">
          <span className="brand-title">
            {roleName === 'teacher' ? 'Instructor' : roleName === 'admin' ? 'Admin' : 'Student'}
          </span>
          <span className="brand-sub">Dashboard</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`sidebar-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
                style={{
                  '--active-color': roleColor
                }}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.name}</span>
                {location.pathname === item.path && (
                  <span className="active-indicator" style={{ background: roleColor }}></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">🚪</span>
          <span className="label">Log Out</span>
        </button>
      </div>
    </aside>
  );
}