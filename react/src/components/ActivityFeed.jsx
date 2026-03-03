import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import echo from '../services/echo';
import '../styles/activity-feed.css';

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    // Listen to multiple channels for activities
    echo.channel('announcements')
      .listen('AnnouncementCreated', (e) => {
        addActivity({
          id: Date.now(),
          type: 'announcement',
          icon: '📢',
          message: `New announcement: ${e.announcement.title}`,
          time: new Date(),
        });
      });

    echo.channel('assignments')
      .listen('AssignmentCreated', (e) => {
        addActivity({
          id: Date.now(),
          type: 'assignment',
          icon: '📝',
          message: `New assignment: ${e.assignment.title}`,
          time: new Date(),
        });
      });

    echo.private(`user.${user.user_ID}`)
      .listen('GradeUpdated', (e) => {
        addActivity({
          id: Date.now(),
          type: 'grade',
          icon: '⭐',
          message: `Grade updated for ${e.grade.assignment.title}`,
          time: new Date(),
        });
      });

    return () => {
      echo.leave('announcements');
      echo.leave('assignments');
      echo.leave(`user.${user.user_ID}`);
    };
  }, [user]);

  const addActivity = (activity) => {
    setActivities(prev => [activity, ...prev].slice(0, 50));
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (activities.length === 0) return null;

  return (
    <div className="activity-feed">
      <h4 className="activity-feed-title">Recent Activity</h4>
      <div className="activity-list">
        {activities.slice(0, 5).map((activity) => (
          <div key={activity.id} className="activity-item">
            <span className="activity-icon">{activity.icon}</span>
            <div className="activity-content">
              <p className="activity-message">{activity.message}</p>
              <span className="activity-time">{getTimeAgo(activity.time)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
