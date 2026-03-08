import { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import '../styles/joinClassModal.css';

export default function JoinClassModal({ isOpen, onClose, onSuccess }) {
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/api/courses/enroll-with-code',
        { class_code: classCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Success
      if (onSuccess) {
        onSuccess(response.data.course);
      }
      setClassCode('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setClassCode('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content join-class-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Join Class</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Ask your teacher for the class code, then enter it here.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="class-code">Class Code</label>
              <input
                type="text"
                id="class-code"
                name="class-code"
                className="form-input"
                placeholder="Enter class code"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                required
                autoFocus
                maxLength={20}
              />
              <p className="input-hint">
                Class codes are usually 6-8 characters (e.g., ABC123XY)
              </p>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !classCode.trim()}
              >
                {loading ? 'Joining...' : 'Join'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
