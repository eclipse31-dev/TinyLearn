import React, { useContext, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '⬛' },
    { name: 'Course', path: '/courses', icon: '📘' },
    { name: 'Resources', path: '/resources', icon: '📂' },
    { name: 'Discussion', path: '/discussion', icon: '💬' },
    { name: 'Schedules', path: '/schedules', icon: '📅' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 🔹 Determine role safely
  const roleName = useMemo(() => {
    if (!user) return 'student'; // default
    if (Array.isArray(user.roles) && user.roles.length > 0) {
      // roles can be array of objects { role: 'teacher' }
      return user.roles[0]?.role?.toLowerCase() || 'student';
    }
    if (typeof user.roles === 'string') {
      return user.roles.toLowerCase();
    }
    return 'student';
  }, [user]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-box">🎓</div>
        <div className="brand-text">
          <span className="brand-title">
            {roleName === 'teacher' ? 'Teacher' : 'Student'}
          </span>
          <span className="brand-sub">Dashboard</span>
        </div>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">↩</span>
          <span className="label">Log Out</span>
        </button>
      </div>
    </aside>
  );
}