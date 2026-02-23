import React, { useState } from 'react';

export default function AssignmentForm({ courseId, assignment = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    description: assignment?.description || '',
    due_date: assignment?.due_date || '',
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
      const url = assignment
        ? `/api/assignments/${assignment.id}`
        : '/api/assignments';
      
      const method = assignment ? 'PUT' : 'POST';

      const payload = assignment
        ? formData
        : {
            ...formData,
            course_id: courseId,
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
          `Failed to ${assignment ? 'update' : 'create'} assignment`
        );
      }

      const data = await response.json();
      onSuccess(data.assignment);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assignment-form">
      <h3>{assignment ? 'Edit Assignment' : 'Create Assignment'}</h3>
      
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
            placeholder="Assignment title"
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
            placeholder="Assignment description"
            rows="6"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="due_date">Due Date</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
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
              : assignment
              ? 'Update Assignment'
              : 'Create Assignment'}
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
