import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paperclip, FileText, Image as ImageIcon, Video, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/submit-assignment.css';

const API_BASE_URL = 'http://localhost:8000/api';

export default function SubmitAssignmentPage() {
  const { assignmentId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignmentAndSubmission();
  }, [assignmentId]);

  const fetchAssignmentAndSubmission = async () => {
    try {
      setLoading(true);
      // Fetch assignment details
      const assignmentRes = await axios.get(
        `${API_BASE_URL}/assignments/${assignmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignment(assignmentRes.data);

      // Fetch existing submission
      try {
        const submissionRes = await axios.get(
          `${API_BASE_URL}/assignments/${assignmentId}/my-submission`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (submissionRes.data.submission_ID) {
          setSubmission(submissionRes.data);
          setFiles(submissionRes.data.files || []);
          setNotes(submissionRes.data.notes || '');
        }
      } catch (error) {
        // No submission yet
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create submission if it doesn't exist
    if (!submission) {
      await createSubmission();
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'file');

      const response = await axios.post(
        `${API_BASE_URL}/submissions/${submission.submission_ID}/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setFiles([...files, response.data.file]);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const createSubmission = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/submissions`,
        {
          assignment_id: assignmentId,
          notes: notes,
          status: 'draft'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmission(response.data.submission);
      return response.data.submission;
    } catch (error) {
      console.error('Error creating submission:', error);
      throw error;
    }
  };

  const handleRemoveFile = async (fileId) => {
    if (!confirm('Are you sure you want to remove this file?')) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/submission-files/${fileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFiles(files.filter(f => f.id !== fileId));
      alert('File removed successfully!');
    } catch (error) {
      console.error('Error removing file:', error);
      alert('Failed to remove file');
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('Please upload at least one file before submitting');
      return;
    }

    if (!confirm('Are you sure you want to submit this assignment? You cannot edit it after submission.')) {
      return;
    }

    try {
      setSubmitting(true);
      
      if (!submission) {
        await createSubmission();
      } else {
        // Update submission status to submitted
        await axios.post(
          `${API_BASE_URL}/submissions`,
          {
            assignment_id: assignmentId,
            notes: notes,
            status: 'submitted'
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      alert('Assignment submitted successfully!');
      navigate('/assignments');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="submit-assignment-page">
          <div className="loading">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  const isSubmitted = submission?.status === 'submitted' || submission?.status === 'graded';
  const isGraded = submission?.status === 'graded';

  return (
    <DashboardLayout>
      <div className="submit-assignment-page">
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate('/assignments')}>
            ← Back to Assignments
          </button>
          <h1>{assignment?.title}</h1>
          <p>{assignment?.description}</p>
          <p className="upload-info">
            <Paperclip size={16} style={{ display: 'inline', color: '#ec4899' }} />
            {' '}You can upload documents, images, or videos
          </p>
        </div>

        <div className="assignment-details">
          <div className="detail-item">
            <span className="label">Due Date:</span>
            <span className="value">{new Date(assignment?.due_date).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <span className="label">Status:</span>
            <span className={`badge badge-${submission?.status || 'pending'}`}>
              {submission?.status || 'Not Submitted'}
            </span>
          </div>
          {isGraded && submission?.grades?.[0] && (
            <div className="detail-item">
              <span className="label">Grade:</span>
              <span className="value grade-score">{submission.grades[0].score}%</span>
            </div>
          )}
        </div>

        {isGraded && submission?.grades?.[0]?.feedback && (
          <div className="feedback-section">
            <h3>Teacher Feedback</h3>
            <div className="feedback-content">
              {submission.grades[0].feedback}
            </div>
          </div>
        )}

        <div className="submission-section">
          <h3>Your Submission</h3>

          {/* File Upload */}
          {!isSubmitted && (
            <div className="upload-section">
              <label className="upload-btn">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.webm"
                  style={{ display: 'none' }}
                />
                <Paperclip size={18} style={{ display: 'inline', marginRight: '8px' }} />
                {uploading ? 'Uploading...' : 'Attach File or Image'}
              </label>
              <p className="upload-hint">
                Supported formats: Documents (PDF, DOC, DOCX), Images (JPG, PNG), Videos (MP4)
              </p>
            </div>
          )}

          {/* Files List */}
          {files.length > 0 && (
            <div className="files-list">
              <h4>Attached Files ({files.length})</h4>
              {files.map((file, index) => (
                <div key={file.id || index} className="file-item">
                  <div className="file-info">
                    <span className="file-icon">{getFileIcon(file.mime_type)}</span>
                    <div className="file-details">
                      <span className="file-name">{file.file_name}</span>
                      <span className="file-size">{formatFileSize(file.file_size)}</span>
                    </div>
                  </div>
                  {!isSubmitted && (
                    <button
                      className="btn-remove"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div className="notes-section">
            <label>Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or comments for your teacher..."
              rows="4"
              disabled={isSubmitted}
            />
          </div>

          {/* Submit Button */}
          {!isSubmitted && (
            <div className="submit-actions">
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting || files.length === 0}
              >
                <CheckCircle size={18} style={{ display: 'inline', marginRight: '8px' }} />
                {submitting ? 'Submitting...' : 'Mark as Done & Submit'}
              </button>
              <p className="submit-hint">
                Make sure all files are uploaded before submitting
              </p>
            </div>
          )}

          {isSubmitted && (
            <div className="submitted-message">
              <p>
                <CheckCircle size={18} style={{ display: 'inline', marginRight: '8px', color: '#065f46' }} />
                Assignment submitted on {new Date(submission.submitted_at).toLocaleString()}
              </p>
              {!isGraded && <p>Waiting for teacher to grade...</p>}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
