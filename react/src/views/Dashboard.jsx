import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const role = user?.roles?.[0]?.role || 'No Role';

  const fullName = useMemo(() => {
    if (!user) return '';
    return `${user.FName || ''} ${user.LName || ''}`.trim();
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      navigate('/login');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <main className="dashboard-main">
        <h3>Welcome, {fullName} 👋</h3>
        <p>Email: {user.email}</p>
        <p>Username: @{user.username}</p>
        <p><strong>Role:</strong> {role}</p>
      </main>
    </div>
  );
}