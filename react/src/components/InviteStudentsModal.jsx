import { useState, useEffect, useContext } from 'react';
import { X, Search } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/inviteStudentsModal.css';

export default function InviteStudentsModal({ isOpen, onClose, courseId, onSuccess }) {
  const { token } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    try {
      setSearching(true);
      const response = await axios.get(
        'http://localhost:8000/api/users',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Filter only students
      const studentList = response.data.filter(user => 
        user.roles && user.roles.some(r => r.role === 'student')
      );
      
      setStudents(studentList);
      setError('');
    } catch (err) {
      setError('Failed to load students');
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const term = searchTerm.toLowerCase();
    return (
      student.FName.toLowerCase().includes(term) ||
      student.LName.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term) ||
      student.username.toLowerCase().includes(term)
    );
  });

  const toggleStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSendInvitations = async () => {
    if (selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/courses/${courseId}/send-invitation`,
        { user_ids: selectedStudents },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onSuccess) {
        onSuccess(response.data);
      }
      
      setSelectedStudents([]);
      setSearchTerm('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStudents([]);
    setSearchTerm('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content invite-students-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Invite Students to Course</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="students-list">
            {searching ? (
              <p className="loading-text">Loading students...</p>
            ) : filteredStudents.length === 0 ? (
              <p className="empty-text">No students found</p>
            ) : (
              filteredStudents.map(student => (
                <div key={student.user_ID} className="student-item">
                  <input
                    type="checkbox"
                    id={`student-${student.user_ID}`}
                    checked={selectedStudents.includes(student.user_ID)}
                    onChange={() => toggleStudent(student.user_ID)}
                    className="student-checkbox"
                  />
                  <label htmlFor={`student-${student.user_ID}`} className="student-label">
                    <div className="student-info">
                      <div className="student-name">
                        {student.FName} {student.LName}
                      </div>
                      <div className="student-email">{student.email}</div>
                    </div>
                  </label>
                </div>
              ))
            )}
          </div>

          {selectedStudents.length > 0 && (
            <div className="selected-count">
              {selectedStudents.length} student(s) selected
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSendInvitations}
            disabled={loading || selectedStudents.length === 0}
          >
            {loading ? 'Sending...' : 'Send Invitations'}
          </button>
        </div>
      </div>
    </div>
  );
}
