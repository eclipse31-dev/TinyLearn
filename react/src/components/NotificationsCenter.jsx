import { useState, useEffect, useContext } from 'react';
import { Bell, BellOff, Megaphone, FileText, Star, MessageSquare } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/notifications-center.css';

export default function NotificationsCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      // Mock notifications for now
      const mockNotifications = [
        {
          id: 1,
          type: 'announcement',
          title: 'New Course Material',
          message: 'Introduction to Programming has new materials',
          time: new Date(Date.now() - 3600000),
          read: false
        },
        {
          id: 2,
          type: 'assignment',
          title: 'Assignment Due Soon',
          message: 'Web Development Assignment due in 2 days',
          time: new Date(Date.now() - 7200000),
          read: false
        },
        {
          id: 3,
          type: 'grade',
          title: 'Grade Posted',
          message: 'Your grade for Quiz 1 has been posted',
          time: new Date(Date.now() - 86400000),
          read: true
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type) => {
    const iconProps = { size: 18, color: '#ec4899' };
    switch (type) {
      case 'announcement': return <Megaphone {...iconProps} />;
      case 'assignment': return <FileText {...iconProps} />;
      case 'grade': return <Star {...iconProps} />;
      case 'message': return <MessageSquare {...iconProps} />;
      default: return <Bell {...iconProps} />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="notifications-center">
      <button 
        className="notifications-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} color="#ec4899" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="notifications-overlay" onClick={() => setIsOpen(false)} />
          <div className="notifications-dropdown">
            <div className="notifications-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="notifications-empty">
                  <BellOff size={48} color="#9ca3af" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="notification-icon">
                      {getIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {getTimeAgo(notification.time)}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="unread-dot"></div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="notifications-footer">
              <button className="view-all-btn">View All Notifications</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
