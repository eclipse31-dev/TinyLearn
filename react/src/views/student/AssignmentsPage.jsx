import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/assignments.css';

const API_BASE_URL = 'http://localhost:8000/api';

export default function AssignmentsPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, submitted, graded

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      // Get enrolled courses
      const coursesRes = await axios.get(`${API_BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Get assignments for all enrolled courses
      const assignmentsPromises = coursesRes.data.map(course =>
        axios.get(`${API_BASE_URL}/courses/${course.course_ID}/assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );

      const assignmentsResults = await Promise.all(assignmentsPromises);
      const allAssignments = assignmentsResults.flatMap(res => res.data);

      // Get submission status for each assignment
      const assignmentsWithStatus = await Promise.all(
        allAssignments.map(async (assignment) => {
          try {
            const subRes = await axios.get(
              `${API_BASE_URL}/assignments/${assignment.assignment_ID}/my-submission`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return {
              ...assignment,
              submission: subRes.data.submission_ID ? subRes.data : null
            };
          } catch (error) {
            return { ...assignment, submission: null };
          }
        })
      );

      setAssignments(assignmentsWithStatus);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !assignment.submission;
    if (filter === 'submitted') return assignment.submission && assignment.submission.status === 'submitted';
    if (filter === 'graded') return assignment.submission && assignment.submission.status === 'graded';
    return true;
  });

  const getStatusBadge = (assignment) => {
    if (!assignment.submission) {
      return <span className="badge badge-pending">Pending</span>;
    }
    if (assignment.submission.status === 'submitted') {
      return <span className="badge badge-submitted">Submitted</span>;
    }
    if (assignment.submission.status === 'graded') {
      return <span className="badge badge-graded">Graded</span>;
    }
    return <span className="badge badge-draft">Draft</span>;
  };

  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return <span className="text-danger">Overdue</span>;
    if (diff === 0) return <span className="text-warning">Due today</span>;
    if (diff === 1) return <span className="text-warning">Due tomorrow</span>;
    return <span className="text-muted">{diff} days remaining</span>;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="assignments-page">
          <div className="loading">Loading assignments...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="assignments-page">
        <div className="page-header">
          <h1>My Assignments</h1>
          <p>View and submit your assignments (documents, images, or videos)</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({assignments.length})
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({assignments.filter(a => !a.submission).length})
          </button>
          <button
            className={`filter-tab ${filter === 'submitted' ? 'active' : ''}`}
            onClick={() => setFilter('submitted')}
          >
            Submitted ({assignments.filter(a => a.submission?.status === 'submitted').length})
          </button>
          <button
            className={`filter-tab ${filter === 'graded' ? 'active' : ''}`}
            onClick={() => setFilter('graded')}
          >
            Graded ({assignments.filter(a => a.submission?.status === 'graded').length})
          </button>
        </div>

        {/* Assignments List */}
        <div className="assignments-list">
          {filteredAssignments.length === 0 ? (
            <div className="empty-state">
              <p>No assignments found</p>
            </div>
          ) : (
            filteredAssignments.map(assignment => (
              <div key={assignment.assignment_ID} className="assignment-card">
                <div className="assignment-header">
                  <div>
                    <h3>{assignment.title}</h3>
                    <p className="course-name">{assignment.module?.course?.title}</p>
                  </div>
                  {getStatusBadge(assignment)}
                </div>

                <p className="assignment-description">{assignment.description}</p>

                <div className="assignment-meta">
                  <div className="meta-item">
                    <span className="meta-label">Due Date:</span>
                    <span className="meta-value">
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="meta-item">
                    {getDaysRemaining(assignment.due_date)}
                  </div>
                  {assignment.submission?.status === 'graded' && (
                    <div className="meta-item">
                      <span className="meta-label">Grade:</span>
                      <span className="meta-value grade-score">
                        {assignment.submission.grades?.[0]?.score || 'N/A'}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="assignment-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/assignments/${assignment.assignment_ID}/submit`)}
                  >
                    {assignment.submission ? 'View Submission' : 'Submit Assignment'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
