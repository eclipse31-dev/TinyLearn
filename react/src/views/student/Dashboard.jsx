import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import OnlineHoursChart from '../../components/OnlineHoursChart';
import OnlineHoursStats from '../../components/OnlineHoursStats';
import JoinClassModal from '../../components/JoinClassModal';
import { AuthContext } from '../../context/AuthContext';
import { BookOpen, Clock, CheckCircle, BarChart, Hand, Plus } from 'lucide-react';
import echo from '../../services/echo';
import axios from 'axios';
import '../../styles/home.css';
import '../../styles/online-hours.css';

export default function StudentDashboard() {
  const { user, token } = useContext(AuthContext);
  const [period, setPeriod] = useState('week');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDashboardStats();

      // Listen for real-time session updates
      const channel = echo.channel('user-sessions');
      
      channel.listen('.session.updated', (data) => {
        console.log('Session updated in student dashboard:', data);
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

  // Check if student has no enrollments
  const hasNoEnrollments = !loading && dashboardStats && dashboardStats.enrolled_courses === 0;

  const handleJoinSuccess = (course) => {
    // Refresh dashboard stats
    fetchDashboardStats();
    alert(`Successfully joined ${course.title}!`);
  };

  return (
    <DashboardLayout>
      <div className="home-page">
        {/* Page Header */}
        <div className="page-header-welcome">
          <div>
            <p className="welcome-message">
              <Hand size={24} className="waving-hand" color="#3b82f6" />
              Welcome back, <span className="user-name-animated">{user?.FName} {user?.LName}</span>!
            </p>
            <h1>Student Dashboard</h1>
          </div>
          <button 
            className="btn-join-class"
            onClick={() => setShowJoinModal(true)}
          >
            <Plus size={20} />
            Join Class
          </button>
        </div>

        {/* Empty State for New Students */}
        {hasNoEnrollments && (
          <div className="empty-enrollment-state-clean">
            <div className="empty-state-content">
              <h1 className="empty-state-title">Welcome to TinyLearn!</h1>
              <p className="empty-state-subtitle">You haven't enrolled in any courses yet.</p>
              <p className="empty-state-subtitle">Use a class code to join your first course!</p>
              <button 
                className="btn-join-class-empty"
                onClick={() => setShowJoinModal(true)}
              >
                <Plus size={20} />
                Join Class
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content - Only show if enrolled in courses */}
        {!hasNoEnrollments && (
          <>
            {/* Student Stats Cards */}
            {!loading && dashboardStats && (
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon">
                    <BookOpen size={32} color="#3b82f6" />
                  </div>
                  <div className="stat-info">
                    <h4>Enrolled Courses</h4>
                    <div className="stat-value">{dashboardStats.enrolled_courses}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Clock size={32} color="#f59e0b" />
                  </div>
                  <div className="stat-info">
                    <h4>Pending Assignments</h4>
                    <div className="stat-value">{dashboardStats.pending_assignments}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <CheckCircle size={32} color="#10b981" />
                  </div>
                  <div className="stat-info">
                    <h4>Submitted</h4>
                    <div className="stat-value">{dashboardStats.submitted_assignments}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <BarChart size={32} color="#ec4899" />
                  </div>
                  <div className="stat-info">
                    <h4>Average Grade</h4>
                    <div className="stat-value">
                      {dashboardStats.average_grade ? `${Math.round(dashboardStats.average_grade)}%` : 'N/A'}
                    </div>
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
          </>
        )}

        {/* Join Class Modal */}
        <JoinClassModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleJoinSuccess}
        />
      </div>
    </DashboardLayout>
  );
}
