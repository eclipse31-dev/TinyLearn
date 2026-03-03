import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import echo from '../services/echo';
import '../styles/online-users.css';

export default function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    // Join presence channel
    const channel = echo.join('online')
      .here((users) => {
        setOnlineUsers(users);
      })
      .joining((user) => {
        setOnlineUsers(prev => [...prev, user]);
      })
      .leaving((user) => {
        setOnlineUsers(prev => prev.filter(u => u.id !== user.id));
      });

    return () => {
      echo.leave('online');
    };
  }, [user]);

  return (
    <div className="online-users">
      <button 
        className="online-users-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Online Users"
      >
        <span className="online-icon">👥</span>
        <span className="online-count">{onlineUsers.length}</span>
      </button>

      {isOpen && (
        <>
          <div className="online-overlay" onClick={() => setIsOpen(false)} />
          <div className="online-dropdown">
            <div className="online-header">
              <h4>Online Now ({onlineUsers.length})</h4>
            </div>
            <div className="online-list">
              {onlineUsers.length === 0 ? (
                <div className="online-empty">
                  <p>No one else is online</p>
                </div>
              ) : (
                onlineUsers.map((onlineUser) => (
                  <div key={onlineUser.id} className="online-user-item">
                    <div className="online-avatar">
                      {onlineUser.name?.charAt(0).toUpperCase() || '?'}
                      <span className="online-status"></span>
                    </div>
                    <div className="online-user-info">
                      <span className="online-user-name">{onlineUser.name}</span>
                      <span className="online-user-role">{onlineUser.role || 'Student'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
