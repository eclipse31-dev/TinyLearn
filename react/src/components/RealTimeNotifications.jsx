import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import echo from '../services/echo';
import '../styles/notifications.css';

export default function RealTimeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    // Listen for new announcements
    echo.channel('announcements')
      .listen('AnnouncementCreated', (e) => {
        addNotification({
          id: Date.now(),
          type: 'announcement',
          title: 'New Announcement',
          message: e.announcement.title,
          time: new Date(),
        });
      });

    // Listen for new assignments
    echo.channel('assignments')
      .listen('AssignmentCreated', (e) => {
        addNotification({
          id: Date.now(),
          type: 'assignment',
          title: 'New Assignment',
          message: e.assignment.title,
          time: new Date(),
        });
      });

    // Listen for grade updates
    echo.private(`user.${user.user_ID}`)
      .listen('GradeUpdated', (e) => {
        addNotification({
          id: Date.now(),
          type: 'grade',
          title: 'Grade Updated',
          message: `Your grade for ${e.assignment.title} has been updated`,
          time: new Date(),
        });
      });

    return () => {
      echo.leave('announcements');
      echo.leave('assignments');
      echo.leave(`user.${user.user_ID}`);
    };
  }, [user]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 10));
    setShow(true);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShow(false);
    }, 5000);

    // Play notification sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {});
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'announcement': return '📢';
      case 'assignment': return '📝';
      case 'grade': return '⭐';
      default: return '🔔';
    }
  };

  return (
    <div className="realtime-notifications">
      {show && notifications.length > 0 && (
        <div className="notification-toast">
          {notifications.slice(0, 3).map(notification => (
            <div key={notification.id} className="notification-item">
              <div className="notification-icon">{getIcon(notification.type)}</div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">Just now</span>
              </div>
              <button 
                className="notification-close"
                onClick={() => clearNotification(notification.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
