import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import OnlineHoursChart from '../../components/OnlineHoursChart';
import OnlineHoursStats from '../../components/OnlineHoursStats';
import { AuthContext } from '../../context/AuthContext';
import echo from '../../services/echo';
import axios from 'axios';
import '../../styles/home.css';
import '../../styles/online-hours.css';

export default function TeacherDashboard() {
  const { user, token } = useContext(AuthContext);
  const [period, setPeriod] = useState('week');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchDashboardStats();

      // Listen for real-time session updates
      const channel = echo.channel('user-sessions');
      
      channel.listen('.session.updated', (data) => {
        console.log('Session updated in teacher dashboard:', data);
        fetchDashboardStats();
      });

      return () => {
        channel.stopListening('.session.updated');
        echo.leaveChannel('user-sessions');
      };
    }
  }, [token]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:8000/api/dashboard/stats',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setDashboardStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="home-page">
        {/* Page Header */}
        <div className="page-header-welcome">
          <h1>Teacher Dashboard</h1>
          <p>Welcome back, {user?.FName} {user?.LName}! 👨‍🏫</p>
        </div>

        {/* Teacher Stats Cards */}
        {!loading && dashboardStats && (
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h4>My Courses</h4>
                <div className="stat-value">{dashboardStats.my_courses}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h4>Total Students</h4>
                <div className="stat-value">{dashboardStats.total_students}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h4>Pending Submissions</h4>
                <div className="stat-value">{dashboardStats.pending_submissions}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <h4>Total Assignments</h4>
                <div className="stat-value">{dashboardStats.total_assignments}</div>
              </div>
            </div>
          </div>
        )}

        {/* Period Selector */}
        <div className="period-selector">
          <button 
            className={`period-btn ${period === 'today' ? 'active' : ''}`}
            onClick={() => setPeriod('today')}
          >
            Today
          </button>
          <button 
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => setPeriod('week')}
          >
            This Week
          </button>
          <button 
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            This Month
          </button>
        </div>

        {/* Online Hours Dashboard */}
        <div className="dashboard-content">
          {/* Left Column - Bar Chart */}
          <div className="left-column">
            <OnlineHoursChart period={period} />
          </div>

          {/* Right Column - Statistics */}
          <div className="right-column">
            <OnlineHoursStats period={period} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
