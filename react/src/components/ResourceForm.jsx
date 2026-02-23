import React, { useState } from 'react';

export default function ResourceForm({ courseId, resource = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    description: resource?.description || '',
    type: resource?.type || 'link',
    url: resource?.url || '',
  });
  const [file, setFile] = useState(null);
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
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);

      if (formData.type === 'link' || formData.type === 'video') {
        formDataToSend.append('url', formData.url);
      }

      if (file) {
        formDataToSend.append('file', file);
      }

      if (!resource) {
        formDataToSend.append('course_id', courseId);
      }

      const url = resource ? `/api/resources/${resource.id}` : '/api/resources';
      const method = resource ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to ${resource ? 'update' : 'create'} resource`
        );
      }

      const data = await response.json();
      onSuccess(data.resource);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resource-form">
      <h3>{resource ? 'Edit Resource' : 'Create Resource'}</h3>

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
            placeholder="Resource title"
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
            placeholder="Resource description (optional)"
            rows="4"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Resource Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="link">Link</option>
            <option value="video">Video</option>
            <option value="file">File</option>
            <option value="image">Image</option>
          </select>
        </div>

        {(formData.type === 'link' || formData.type === 'video') && (
          <div className="form-group">
            <label htmlFor="url">URL</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              required
              disabled={loading}
            />
          </div>
        )}

        {(formData.type === 'file' || formData.type === 'image') && (
          <div className="form-group">
            <label htmlFor="file">Upload File</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept={formData.type === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
              disabled={loading}
            />
            {file && <p className="file-info">Selected: {file.name}</p>}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : resource ? 'Update Resource' : 'Add Resource'}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
