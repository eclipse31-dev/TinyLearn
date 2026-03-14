import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react';
import '../../styles/admin.css';

export default function AnalyticsDashboard() {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const [statsRes, userStatsRes, courseStatsRes, activityRes] = await Promise.all([
        axios.get('http://localhost:8000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:8000/api/admin/user-stats?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:8000/api/admin/course-stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:8000/api/admin/activity-logs?per_page=10', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data);
      setUserStats(userStatsRes.data);
      setCourseStats(courseStatsRes.data);
      setActivityLogs(activityRes.data.data || []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading analytics...</div>
      </DashboardLayout>
    );
  }

  const COLORS = ['#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

  return (
    <DashboardLayout>
      <div className="admin-container">
        <div className="admin-header">
          <h1>Analytics Dashboard</h1>
          <p>System-wide analytics and insights</p>
        </div>

        {/* Key Metrics */}
        {stats && (
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <Users size={32} color="#ec4899" />
              </div>
              <div className="metric-info">
                <h4>Total Users</h4>
                <div className="metric-value">{stats.total_users}</div>
                <p className="metric-subtitle">Active: {stats.active_users_online}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <BookOpen size={32} color="#10b981" />
              </div>
              <div className="metric-info">
                <h4>Total Courses</h4>
                <div className="metric-value">{stats.total_courses}</div>
                <p className="metric-subtitle">Enrollments: {stats.total_enrollments}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <FileText size={32} color="#f59e0b" />
              </div>
              <div className="metric-info">
                <h4>Assignments</h4>
                <div className="metric-value">{stats.total_assignments}</div>
                <p className="metric-subtitle">Submitted: {stats.submitted_assignments}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">
                <TrendingUp size={32} color="#3b82f6" />
              </div>
              <div className="metric-info">
                <h4>Avg Grade</h4>
                <div className="metric-value">{stats.average_grade}%</div>
                <p className="metric-subtitle">Completion: {stats.completed_enrollments}</p>
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

        {/* Charts */}
        <div className="charts-grid">
          {/* Users by Role */}
          {userStats && userStats.users_by_role && (
            <div className="chart-container">
              <h3>Users by Role</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(userStats.users_by_role).map(([role, count]) => ({
                      name: role,
                      value: count
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(userStats.users_by_role).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Courses */}
          {courseStats && courseStats.top_courses && (
            <div className="chart-container">
              <h3>Top Courses by Enrollment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseStats.top_courses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="course_name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="enrollments_count" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Course Stats */}
        {courseStats && (
          <div className="stats-section">
            <h3>Course Statistics</h3>
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-label">Total Courses</span>
                <span className="stat-value">{courseStats.total_courses}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Active Courses</span>
                <span className="stat-value">{courseStats.active_courses}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Archived Courses</span>
                <span className="stat-value">{courseStats.archived_courses}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="activity-section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {activityLogs.length === 0 ? (
              <p className="empty-state">No recent activity</p>
            ) : (
              activityLogs.map((log, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-info">
                    <p className="activity-action">
                      <strong>{log.user?.FName} {log.user?.LName}</strong> {log.action}
                    </p>
                    <p className="activity-path">{log.path}</p>
                  </div>
                  <div className="activity-meta">
                    <span className={`status-badge ${log.status_code >= 200 && log.status_code < 300 ? 'success' : 'error'}`}>
                      {log.status_code}
                    </span>
                    <span className="activity-time">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
