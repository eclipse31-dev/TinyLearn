import React, { useState } from 'react';

export default function AnnouncementForm({ courseId, announcement = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: announcement?.title || '',
    content: announcement?.content || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = announcement
        ? `/api/announcements/${announcement.id}`
        : '/api/announcements';
      
      const method = announcement ? 'PUT' : 'POST';

      const payload = announcement
        ? formData
        : {
            ...formData,
            course_id: courseId,
            posted_at: new Date().toISOString(),
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${announcement ? 'update' : 'create'} announcement`
        );
      }

      const data = await response.json();
      onSuccess(data.announcement);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="announcement-form">
      <h3>{announcement ? 'Edit Announcement' : 'Create Announcement'}</h3>
      
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Announcement title"
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
            placeholder="Announcement content"
            rows="6"
            required
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            {loading
              ? 'Saving...'
              : announcement
              ? 'Update Announcement'
              : 'Create Announcement'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-cancel"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
