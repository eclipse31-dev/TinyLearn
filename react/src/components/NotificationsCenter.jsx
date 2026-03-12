import { useState, useEffect, useContext } from 'react';
import { Bell, BellOff, Megaphone, FileText, Star, MessageSquare, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useRealtime } from '../hooks/useRealtime';
import axios from 'axios';
import '../styles/notifications-center.css';

export default function NotificationsCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { token, user } = useContext(AuthContext);

  // Listen for real-time notifications
  useRealtime(`user.${user?.user_ID}`, 'notification.created', (data) => {
    console.log('New notification received:', data);
    addNotification(data);
  }, true);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(
        `${apiUrl}/api/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const data = response.data || [];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read_at).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const deleteNotification = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.delete(
        `${apiUrl}/api/notifications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === id);
        return notification && !notification.read_at ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.put(
        `${apiUrl}/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.post(
        `${apiUrl}/api/notifications/mark-all-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteAllNotifications = async () => {
    if (!window.confirm('Delete all notifications?')) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.delete(
        `${apiUrl}/api/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  const getIcon = (type) => {
    const iconProps = { size: 18, color: '#ec4899' };
    switch (type) {
      case 'announcement': return <Megaphone {...iconProps} />;
      case 'assignment': return <FileText {...iconProps} />;
      case 'grade': return <Star {...iconProps} />;
      case 'message': return <MessageSquare {...iconProps} />;
      case 'course_invitation': return <FileText {...iconProps} />;
      default: return <Bell {...iconProps} />;
    }
  };

  const handleAcceptInvitation = async (notification) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const courseId = notification.data?.course_id;
      
      if (!courseId) {
        console.error('No course ID in notification');
        return;
      }

      // Accept the invitation by enrolling
      await axios.post(
        `${apiUrl}/api/courses/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mark notification as read
      await markAsRead(notification.id);
      
      alert('Successfully accepted course invitation!');
    } catch (error) {
      console.error('Error accepting invitation:', error);
      alert('Failed to accept invitation');
    }
  };

  const handleRejectInvitation = async (notification) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Delete the notification (reject)
      await deleteNotification(notification.id);
      
      alert('Invitation rejected');
    } catch (error) {
      console.error('Error rejecting invitation:', error);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Just now';
    const d = new Date(date);
    const seconds = Math.floor((new Date() - d) / 1000);
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
              <div className="notifications-actions">
                {unreadCount > 0 && (
                  <button 
                    className="mark-all-read"
                    onClick={markAllAsRead}
                    title="Mark all as read"
                  >
                    Mark all as read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    className="delete-all-btn"
                    onClick={deleteAllNotifications}
                    title="Delete all notifications"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
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
                    className={`notification-item ${!notification.read_at ? 'unread' : ''}`}
                  >
                    <div className="notification-icon">
                      {getIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {getTimeAgo(notification.created_at)}
                      </span>
                      
                      {notification.type === 'course_invitation' && !notification.read_at && (
                        <div className="invitation-actions">
                          <button
                            className="btn-accept-invitation"
                            onClick={() => handleAcceptInvitation(notification)}
                          >
                            Accept
                          </button>
                          <button
                            className="btn-reject-invitation"
                            onClick={() => handleRejectInvitation(notification)}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="notification-actions">
                      {!notification.read_at && notification.type !== 'course_invitation' && (
                        <button
                          className="mark-read-btn"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {!notification.read_at && (
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
