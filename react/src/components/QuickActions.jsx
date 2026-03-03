import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/quick-actions.css';

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: '📚', label: 'New Course', path: '/courses/create', color: '#ec4899' },
    { icon: '📝', label: 'New Assignment', path: '/assignments/create', color: '#3b82f6' },
    { icon: '📢', label: 'New Announcement', path: '/announcements/create', color: '#8b5cf6' },
    { icon: '📁', label: 'Upload Resource', path: '/resources/create', color: '#10b981' },
    { icon: '📅', label: 'Add Schedule', path: '/schedules', color: '#f59e0b' },
  ];

  const handleAction = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="quick-actions">
      <button 
        className="quick-actions-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Quick Actions"
      >
        <span className="quick-actions-icon">⚡</span>
      </button>

      {isOpen && (
        <>
          <div className="quick-actions-overlay" onClick={() => setIsOpen(false)} />
          <div className="quick-actions-menu">
            <h4 className="quick-actions-title">Quick Actions</h4>
            <div className="quick-actions-grid">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-item"
                  onClick={() => handleAction(action.path)}
                  style={{ '--action-color': action.color }}
                >
                  <span className="quick-action-icon">{action.icon}</span>
                  <span className="quick-action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
