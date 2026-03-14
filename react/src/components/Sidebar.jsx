import React, { useContext, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, FolderOpen, MessageSquare, Calendar, Settings, LogOut, GraduationCap, Briefcase, Menu, X, Users, BarChart3 } from 'lucide-react';
import '../styles/sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Materials', path: '/resources', icon: FolderOpen },
    { name: 'Discussion', path: '/discussion', icon: MessageSquare },
    { name: 'Schedules', path: '/schedules', icon: Calendar },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
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
  const currentMenuItems = roleName === 'admin' ? adminMenuItems : menuItems;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-box" style={{ background: roleColor }}>
            {roleName === 'teacher' || roleName === 'admin' ? (
              <Briefcase size={28} color="#fff" />
            ) : (
              <GraduationCap size={28} color="#fff" />
            )}
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
            {currentMenuItems.map(item => {
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`sidebar-link ${
                      location.pathname === item.path ? 'active' : ''
                    }`}
                    style={{
                      '--active-color': roleColor
                    }}
                    onClick={handleLinkClick}
                  >
                    <span className="icon">
                      <IconComponent size={20} color={location.pathname === item.path ? roleColor : '#6b7280'} />
                    </span>
                    <span className="label">{item.name}</span>
                    {location.pathname === item.path && (
                      <span className="active-indicator" style={{ background: roleColor }}></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="icon">
              <LogOut size={20} color="#ef4444" />
            </span>
            <span className="label">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
