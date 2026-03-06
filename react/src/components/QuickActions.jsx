import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Megaphone, FolderOpen, Calendar, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import '../styles/quick-actions.css';

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Check user role
  const isTeacherOrAdmin = user?.roles?.[0]?.role === 'teacher' || user?.roles?.[0]?.role === 'admin';

  const actions = [
    { 
      icon: BookOpen, 
      label: 'New Course', 
      path: '/courses/create', 
      color: '#ec4899',
      roles: ['teacher', 'admin']
    },
    { 
      icon: FileText, 
      label: 'New Assignment', 
      path: '/assignments/create', 
      color: '#3b82f6',
      roles: ['teacher', 'admin']
    },
    { 
      icon: Megaphone, 
      label: 'New Announcement', 
      path: '/announcements/create', 
      color: '#8b5cf6',
      roles: ['teacher', 'admin']
    },
    { 
      icon: FolderOpen, 
      label: 'Upload Resource', 
      path: '/resources/create', 
      color: '#10b981',
      roles: ['teacher', 'admin']
    },
    { 
      icon: Calendar, 
      label: 'Add Schedule', 
      path: '/schedules', 
      color: '#f59e0b',
      roles: ['teacher', 'admin', 'student']
    },
  ];

  // Filter actions based on user role
  const userRole = user?.roles?.[0]?.role?.toLowerCase() || 'student';
  const filteredActions = actions.filter(action => 
    action.roles.includes(userRole)
  );

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
        <Zap size={24} color="#fff" />
      </button>

      {isOpen && (
        <>
          <div className="quick-actions-overlay" onClick={() => setIsOpen(false)} />
          <div className="quick-actions-menu">
            <h4 className="quick-actions-title">Quick Actions</h4>
            <div className="quick-actions-grid">
              {filteredActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={index}
                    className="quick-action-item"
                    onClick={() => handleAction(action.path)}
                    style={{ '--action-color': action.color }}
                  >
                    <span className="quick-action-icon">
                      <IconComponent size={32} color={action.color} />
                    </span>
                    <span className="quick-action-label">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
