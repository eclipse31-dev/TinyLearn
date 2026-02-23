import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import '../styles/createForm.css';

const API_BASE_URL = 'http://localhost:8000';

export default function CreateAnnouncementPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const annoucement_payload = {
        course_ID: parseInt(courseId),
        title: formData.title,
        content: formData.content,
      };

      const response = await fetch(`${API_BASE_URL}/api/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(annoucement_payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.errors?.title?.[0] || 'Failed to create announcement');
      }

      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="create-form-page">
        <div className="form-container">
          <div className="form-header">
            <h1>📢 Create Announcement</h1>
            <p>Share important updates with your students</p>
          </div>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Important Update, Schedule Change"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your announcement here..."
                rows="8"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="attachment">Attach File (Optional)</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="attachment"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="file-input"
                />
                {selectedFile && (
                  <p className="file-name">📎 {selectedFile.name}</p>
                )}
              </div>
              <p className="file-help">Attach a file to include with this announcement. File will be uploaded with the announcement.</p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(`/courses/${courseId}`)}
                disabled={loading}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-submit"
              >
                {loading ? 'Creating...' : 'Create Announcement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

