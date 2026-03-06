import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Image as ImageIcon, Video, Paperclip, Download, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/grade-submissions.css';

const API_BASE_URL = 'http://localhost:8000/api';

export default function GradeSubmissionsPage() {
  const { assignmentId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [grading, setGrading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignmentAndSubmissions();
  }, [assignmentId]);

  const fetchAssignmentAndSubmissions = async () => {
    try {
      setLoading(true);
      // Fetch assignment
      const assignmentRes = await axios.get(
        `${API_BASE_URL}/assignments/${assignmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignment(assignmentRes.data);

      // Fetch submissions
      const submissionsRes = await axios.get(
        `${API_BASE_URL}/assignments/${assignmentId}/submissions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmissions(submissionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission);
    const existingGrade = submission.grades?.[0];
    if (existingGrade) {
      setScore(existingGrade.score);
      setFeedback(existingGrade.feedback || '');
    } else {
      setScore('');
      setFeedback('');
    }
  };

  const handleGradeSubmission = async () => {
    if (!score || score < 0 || score > 100) {
      alert('Please enter a valid score between 0 and 100');
      return;
    }

    try {
      setGrading(true);
      await axios.post(
        `${API_BASE_URL}/submissions/${selectedSubmission.submission_ID}/grade`,
        {
          score: parseFloat(score),
          feedback: feedback
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Submission graded successfully!');
      fetchAssignmentAndSubmissions();
      setSelectedSubmission(null);
      setScore('');
      setFeedback('');
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  const downloadFile = (file) => {
    const url = `${API_BASE_URL.replace('/api', '')}/storage/${file.file_path}`;
    window.open(url, '_blank');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    const iconStyle = { color: '#ec4899', size: 24 };
    if (mimeType?.includes('pdf')) return <FileText {...iconStyle} />;
    if (mimeType?.includes('image')) return <ImageIcon {...iconStyle} />;
    if (mimeType?.includes('video')) return <Video {...iconStyle} />;
    if (mimeType?.includes('word')) return <FileText {...iconStyle} />;
    return <Paperclip {...iconStyle} />;
  };

  const getStatusBadge = (submission) => {
    if (submission.status === 'graded') {
      return <span className="badge badge-graded">Graded</span>;
    }
    if (submission.status === 'submitted') {
      return <span className="badge badge-submitted">Pending Review</span>;
    }
    return <span className="badge badge-draft">Draft</span>;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grade-submissions-page">
          <div className="loading">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grade-submissions-page">
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate('/courses')}>
            <ArrowLeft size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Back to Courses
          </button>
          <h1>{assignment?.title}</h1>
          <p>Grade student submissions</p>
        </div>

        <div className="submissions-stats">
          <div className="stat-card">
            <span className="stat-value">{submissions.length}</span>
            <span className="stat-label">Total Submissions</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {submissions.filter(s => s.status === 'graded').length}
            </span>
            <span className="stat-label">Graded</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {submissions.filter(s => s.status === 'submitted').length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        <div className="submissions-container">
          {/* Submissions List */}
          <div className="submissions-list">
            <h3>Student Submissions</h3>
            {submissions.length === 0 ? (
              <div className="empty-state">
                <p>No submissions yet</p>
              </div>
            ) : (
              submissions.map(submission => (
                <div
                  key={submission.submission_ID}
                  className={`submission-item ${selectedSubmission?.submission_ID === submission.submission_ID ? 'active' : ''}`}
                  onClick={() => handleSelectSubmission(submission)}
                >
                  <div className="submission-header">
                    <div className="student-info">
                      <span className="student-name">
                        {submission.user?.FName} {submission.user?.LName}
                      </span>
                      <span className="submission-date">
                        {new Date(submission.submitted_at || submission.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {getStatusBadge(submission)}
                  </div>
                  {submission.grades?.[0] && (
                    <div className="submission-grade">
                      Grade: {submission.grades[0].score}%
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Submission Details */}
          {selectedSubmission && (
            <div className="submission-details">
              <h3>Submission Details</h3>

              <div className="student-section">
                <h4>Student</h4>
                <p>
                  {selectedSubmission.user?.FName} {selectedSubmission.user?.LName}
                </p>
                <p className="text-muted">{selectedSubmission.user?.email}</p>
              </div>

              {/* Files */}
              {selectedSubmission.files?.length > 0 && (
                <div className="files-section">
                  <h4>Attached Files ({selectedSubmission.files.length})</h4>
                  {selectedSubmission.files.map((file, index) => (
                    <div key={file.id || index} className="file-item">
                      <div className="file-info">
                        <span className="file-icon">{getFileIcon(file.mime_type)}</span>
                        <div className="file-details">
                          <span className="file-name">{file.file_name}</span>
                          <span className="file-size">{formatFileSize(file.file_size)}</span>
                        </div>
                      </div>
                      <button
                        className="btn-download"
                        onClick={() => downloadFile(file)}
                      >
                        <Download size={16} style={{ display: 'inline', marginRight: '6px' }} />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Student Notes */}
              {selectedSubmission.notes && (
                <div className="notes-section">
                  <h4>Student Notes</h4>
                  <p>{selectedSubmission.notes}</p>
                </div>
              )}

              {/* Grading Form */}
              <div className="grading-section">
                <h4>Grade Submission</h4>
                
                <div className="form-group">
                  <label>Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Enter score"
                  />
                </div>

                <div className="form-group">
                  <label>Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback to the student..."
                    rows="5"
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleGradeSubmission}
                  disabled={grading || !score}
                >
                  {grading ? 'Saving...' : 'Save Grade'}
                </button>
              </div>
            </div>
          )}

          {!selectedSubmission && submissions.length > 0 && (
            <div className="submission-details empty">
              <p>Select a submission to view details and grade</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
