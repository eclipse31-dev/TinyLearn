import { useState, useEffect, useContext } from 'react';
import { useRealtime } from '../hooks/useRealtime';
import { AuthContext } from '../context/AuthContext';
import realtimeService from '../services/realtimeService';
import { Activity, Users, MessageSquare, AlertCircle } from 'lucide-react';

export default function RealtimeDashboard() {
  const { user } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // Listen for online users
  useRealtime('online-users', 'user.online', (data) => {
    setOnlineUsers(prev => {
      const exists = prev.find(u => u.user_id === data.user_id);
      if (exists) {
        return prev.map(u => u.user_id === data.user_id ? { ...u, ...data } : u);
      }
      return [...prev, data];
    });
    
    addEvent('user_online', `User ${data.user_id} came online`);
  });

  // Listen for session updates
  useRealtime('user-sessions', 'session.updated', (data) => {
    addEvent('session_update', `Session updated for user ${data.user_id}`);
  });

  // Listen for notifications
  useRealtime(`user.${user?.user_ID}`, 'notification.created', (data) => {
    addEvent('notification', data.message || 'New notification');
  }, true);

  const addEvent = (type, message) => {
    setRecentEvents(prev => [
      { id: Date.now(), type, message, timestamp: new Date() },
      ...prev.slice(0, 9)
    ]);
  };

  useEffect(() => {
    // Check connection status
    const checkConnection = () => {
      if (realtimeService.channels && Object.keys(realtimeService.channels).length > 0) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    };

    const interval = setInterval(checkConnection, 5000);
    checkConnection();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="realtime-dashboard">
      <div className="dashboard-header">
        <h2>Real-time Dashboard</h2>
        <div className={`connection-status ${connectionStatus}`}>
          <Activity size={16} />
          {connectionStatus === 'connected' ? 'Connected' : 'Connecting...'}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Online Users */}
        <div className="dashboard-card">
          <div className="card-header">
            <Users size={20} />
            <h3>Online Users ({onlineUsers.length})</h3>
          </div>
          <div className="card-content">
            {onlineUsers.length === 0 ? (
              <p className="empty-state">No users online</p>
            ) : (
              <ul className="users-list">
                {onlineUsers.slice(0, 5).map(u => (
                  <li key={u.user_id} className="user-item">
                    <span className="online-indicator"></span>
                    User {u.user_id}
                  </li>
                ))}
                {onlineUsers.length > 5 && (
                  <li className="more-users">+{onlineUsers.length - 5} more</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="dashboard-card">
          <div className="card-header">
            <MessageSquare size={20} />
            <h3>Recent Events</h3>
          </div>
          <div className="card-content">
            {recentEvents.length === 0 ? (
              <p className="empty-state">No events yet</p>
            ) : (
              <ul className="events-list">
                {recentEvents.map(event => (
                  <li key={event.id} className={`event-item ${event.type}`}>
                    <span className="event-type">{event.type}</span>
                    <span className="event-message">{event.message}</span>
                    <span className="event-time">
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .realtime-dashboard {
          padding: 20px;
          background: var(--bg-secondary, #f9fafb);
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .dashboard-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
        }

        .connection-status.connected {
          background: #d1fae5;
          color: #065f46;
        }

        .connection-status.disconnected {
          background: #fee2e2;
          color: #991b1b;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .dashboard-card {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .card-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .card-content {
          padding: 16px;
          max-height: 300px;
          overflow-y: auto;
        }

        .empty-state {
          text-align: center;
          color: #9ca3af;
          padding: 20px;
          margin: 0;
        }

        .users-list,
        .events-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .user-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 6px;
          background: #f3f4f6;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .online-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .more-users {
          padding: 10px;
          text-align: center;
          color: #6b7280;
          font-size: 13px;
        }

        .event-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px;
          border-radius: 6px;
          background: #f3f4f6;
          margin-bottom: 8px;
          font-size: 13px;
          border-left: 3px solid #ec4899;
        }

        .event-type {
          font-weight: 600;
          color: #1f2937;
          text-transform: uppercase;
          font-size: 11px;
        }

        .event-message {
          color: #4b5563;
        }

        .event-time {
          color: #9ca3af;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
