import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import echo from '../services/echo';

export default function OnlineHoursStats({ period = 'week' }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchStats();

    // Listen for real-time session updates
    const channel = echo.channel('user-sessions');
    
    channel.listen('.session.updated', (data) => {
      console.log('Session updated in stats:', data);
      
      // Show toast notification
      showSessionNotification(data);
      
      // Refresh stats when sessions change
      fetchStats();
    });

    return () => {
      channel.stopListening('.session.updated');
      echo.leaveChannel('user-sessions');
    };
  }, [period]);

  const showSessionNotification = (data) => {
    const message = data.action === 'login' 
      ? `🟢 ${data.user_name} is now online`
      : `🔴 ${data.user_name} went offline`;
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'session-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: ${data.action === 'login' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/dashboard/online-hours?period=${period}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching online hours stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#ec4899'; // Pink
      case 'teacher':
        return '#ec4899'; // Pink
      case 'student':
        return '#3b82f6'; // Blue
      default:
        return '#6b7280'; // Gray
    }
  };

  const getRoleBadge = (role) => {
    const color = getRoleColor(role);
    return (
      <span 
        className="role-badge" 
        style={{ 
          backgroundColor: color + '20', 
          color: color,
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        }}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="stats-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchStats} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="online-hours-stats">
      <div className="stats-header">
        <div>
          <h3>Online Hours Statistics</h3>
          <span className="realtime-indicator">
            <span className="realtime-dot"></span>
            Live
          </span>
        </div>
        <div className="period-info">
          <span className="period-label">Period: {period}</span>
          <span className="active-users">
            🟢 {stats?.active_users || 0} users currently online
          </span>
        </div>
      </div>

      {stats?.users && stats.users.length > 0 ? (
        <div className="users-list">
          {stats.users.slice(0, 10).map((user, index) => (
            <div key={user.user_id} className="user-stat-item">
              <div className="user-rank">#{index + 1}</div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-details">
                  {getRoleBadge(user.role)}
                  <span className="sessions-count">
                    {user.sessions_count} session{user.sessions_count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="user-hours">
                <div className="hours-value">{user.total_hours}h</div>
                <div className="hours-label">online</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <p>No online activity data available for this period.</p>
        </div>
      )}

      {stats?.users && stats.users.length > 10 && (
        <div className="show-more">
          <p>Showing top 10 users. Total: {stats.users.length} users</p>
        </div>
      )}
    </div>
  );
}