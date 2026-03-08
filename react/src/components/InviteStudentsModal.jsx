import { useState } from 'react';
import { X, Mail, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import '../styles/inviteStudentsModal.css';

export default function InviteStudentsModal({ isOpen, onClose, course }) {
  const [emails, setEmails] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleRemoveEmail = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails.length > 0 ? newEmails : ['']);
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Filter out empty emails
    const validEmails = emails.filter(email => email.trim() !== '');

    if (validEmails.length === 0) {
      setError('Please enter at least one email address');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8000/api/courses/${course.course_ID}/send-invitation`,
        { emails: validEmails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(response.data.message);
      
      // Show failed emails if any
      if (response.data.failed_emails && response.data.failed_emails.length > 0) {
        setError(`Failed to send to: ${response.data.failed_emails.join(', ')}`);
      }

      // Reset form after 2 seconds
      setTimeout(() => {
        setEmails(['']);
        setSuccess('');
        setError('');
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmails(['']);
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content invite-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Invite Students</h2>
            <p className="course-name">{course?.title}</p>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="class-code-display">
            <div className="class-code-label">Class Code</div>
            <div className="class-code-value">{course?.course_code}</div>
            <p className="class-code-hint">Students can also join using this code</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <label>Student Email Addresses</label>
              <p className="form-hint">
                Enter the email addresses of students you want to invite. They will receive an invitation link and the class code.
              </p>

              <div className="email-list">
                {emails.map((email, index) => (
                  <div key={index} className="email-input-group">
                    <Mail size={18} className="email-icon" />
                    <input
                      type="email"
                      className="form-input"
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      required={index === 0}
                    />
                    {emails.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-email"
                        onClick={() => handleRemoveEmail(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn-add-email"
                onClick={handleAddEmail}
              >
                <Plus size={16} />
                Add Another Email
              </button>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <span className="success-icon">✓</span>
                {success}
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
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Invitations'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
