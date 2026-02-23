import React, { useState, useEffect } from 'react';
import '../styles/courseForm.css';

export default function CourseForm({ course = null, onSuccess, onCancel, token }) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    status: course?.status || 'draft',
    header_image_url: course?.header_image_url || '',
    days_of_week: course?.days_of_week ? (Array.isArray(course.days_of_week) ? course.days_of_week : [course.days_of_week]) : [],
    start_time: course?.start_time || '',
    end_time: course?.end_time || '',
    recurrence_pattern: course?.recurrence_pattern || 'weekly',
    recurrence_end_date: course?.recurrence_end_date || '',
    has_schedule: course?.has_schedule ? true : false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      const API_BASE = "http://localhost:8000";
      const url = course
        ? `${API_BASE}/api/courses/${course.course_ID}`
        : `${API_BASE}/api/courses`;
      const method = course ? 'PUT' : 'POST';
      const authToken = token || localStorage.getItem('token');

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.errors?.title?.[0] ||
          errorData.message ||
          `Failed to ${course ? 'update' : 'create'} course`
        );
      }

      const data = await response.json();
      onSuccess(data.course);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const API_BASE = "http://localhost:8000";
      const authToken = token || localStorage.getItem('token');

      const response = await fetch(`${API_BASE}/api/courses/${course.course_ID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete course');
      }

      setShowDeleteModal(false);
      // Navigate to courses page or call success callback
      onSuccess(null, 'deleted');
    } catch (err) {
      console.error('Error deleting course:', err);
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="course-form">
      <h3>{course ? 'Edit Course' : 'Create Course'}</h3>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Course Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Course title"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Course description"
            rows="4"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="header_image_url">Header Image URL</label>
          <input
            type="url"
            id="header_image_url"
            name="header_image_url"
            value={formData.header_image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="has_schedule">
            <input
              type="checkbox"
              id="has_schedule"
              name="has_schedule"
              checked={formData.has_schedule}
              onChange={(e) => {
                const { name, checked } = e.target;
                setFormData((prev) => ({ ...prev, [name]: checked }));
              }}
              disabled={loading}
            />
            This course has a regular class schedule
          </label>
        </div>

        {formData.has_schedule && (
          <>
            <div className="form-group">
              <label>Days of Week</label>
              <div className="days-selection" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
                  <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="checkbox"
                      checked={formData.days_of_week.includes(day)}
                      onChange={() => {
                        setFormData((prev) => {
                          const days = prev.days_of_week.includes(day)
                            ? prev.days_of_week.filter(d => d !== day)
                            : [...prev.days_of_week, day];
                          return { ...prev, days_of_week: days };
                        });
                      }}
                      disabled={loading}
                    />
                    <span>{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="start_time">Start Time</label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_time">End Time</label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="recurrence_pattern">Recurrence Pattern</label>
                <select
                  id="recurrence_pattern"
                  name="recurrence_pattern"
                  value={formData.recurrence_pattern}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="recurrence_end_date">End Date</label>
                <input
                  type="date"
                  id="recurrence_end_date"
                  name="recurrence_end_date"
                  value={formData.recurrence_end_date}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
          </button>
          <button type="button" onClick={onCancel} disabled={loading} className="btn-cancel">
            Cancel
          </button>
          {course && (
            <button 
              type="button" 
              onClick={() => setShowDeleteModal(true)} 
              disabled={loading} 
              className="btn-delete"
            >
              Delete Course
            </button>
          )}
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-small">
            <div className="modal-header">
              <h2>Delete Course</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="delete-warning">
                Are you sure you want to delete <strong>"{course?.title}"</strong>? This action cannot be undone.
              </p>
              {error && <div className="form-error">{error}</div>}
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn-delete-confirm"
                >
                  {deleting ? 'Deleting...' : 'Delete Course'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}