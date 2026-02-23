import React, { useState, useEffect } from 'react';

export default function SubmissionForm({ assignmentId, onSuccess, onCancel }) {
  const [submission, setSubmission] = useState(null);
  const [formData, setFormData] = useState({
    notes: '',
  });
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [newFile, setNewFile] = useState({
    type: 'link',
    url: '',
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing submission if any
  useEffect(() => {
    async function fetchSubmission() {
      try {
        const response = await fetch(`/api/assignments/${assignmentId}/my-submission`);
        if (response.ok) {
          const data = await response.json();
          if (data.id) {
            setSubmission(data);
            setFormData({ notes: data.notes || '' });
            setSubmissionFiles(data.files || []);
          }
        }
      } catch (err) {
        console.error('Error fetching submission:', err);
      } finally {
        setSubmissionLoading(false);
      }
    }
    fetchSubmission();
  }, [assignmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewFile((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleNewFileChange = (e) => {
    const { name, value } = e.target;
    setNewFile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let submissionToUse = submission;

      if (!submission) {
        // Create new submission
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            assignment_id: assignmentId,
            notes: formData.notes,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create submission');
        }

        const data = await response.json();
        submissionToUse = data.submission;
        setSubmission(submissionToUse);
      } else {
        // Update existing submission
        const response = await fetch(`/api/submissions/${submission.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            notes: formData.notes,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update submission');
        }
      }

      onSuccess(submissionToUse);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!submission) {
        // Create submission first
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            assignment_id: assignmentId,
            notes: formData.notes,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create submission');
        }

        const data = await response.json();
        setSubmission(data.submission);

        // Add file to new submission
        await addFileToSubmission(data.submission.id);
      } else {
        // Add file to existing submission
        await addFileToSubmission(submission.id);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addFileToSubmission = async (submissionId) => {
    const formDataToSend = new FormData();
    formDataToSend.append('type', newFile.type);

    if (newFile.type === 'link' || newFile.type === 'video') {
      if (!newFile.url) {
        throw new Error('Please enter a URL');
      }
      formDataToSend.append('url', newFile.url);
    }

    if (newFile.file) {
      formDataToSend.append('file', newFile.file);
    }

    const response = await fetch(`/api/submissions/${submissionId}/files`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error('Failed to add file to submission');
    }

    const data = await response.json();
    setSubmissionFiles((prev) => [...prev, data.file]);
    setNewFile({ type: 'link', url: '', file: null });
  };

  const handleRemoveFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to remove this file?')) {
      return;
    }

    try {
      const response = await fetch(`/api/submission-files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove file');
      }

      setSubmissionFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  if (submissionLoading) {
    return <div className="submission-form"><p>Loading submission...</p></div>;
  }

  const getFileIcon = (type, mimeType) => {
    if (type === 'link') return '🔗';
    if (type === 'video') return '🎥';
    if (type === 'image') return '🖼️';
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('word') || mimeType?.includes('document')) return '📝';
    return '📁';
  };

  return (
    <div className="submission-form">
      <h3>Assignment Submission</h3>

      {error && <div className="form-error">{error}</div>}
      {submission && (
        <div className="submission-status">
          <p>
            <strong>Status:</strong>{' '}
            <span className={`status-badge ${submission.status}`}>
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </span>
          </p>
          {submission.submitted_at && (
            <p>
              <strong>Submitted:</strong> {new Date(submission.submitted_at).toLocaleString()}
            </p>
          )}
          {submission.grade !== null && (
            <p>
              <strong>Grade:</strong> {submission.grade}/100
            </p>
          )}
          {submission.feedback && (
            <div className="feedback-section">
              <strong>Feedback:</strong>
              <p>{submission.feedback}</p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmitForm}>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add notes to your submission (optional)"
            rows="4"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : submission ? 'Update Submission' : 'Create Submission'}
        </button>
      </form>

      <div className="submission-files-section">
        <h4>Submission Files</h4>

        {submissionFiles.length > 0 && (
          <div className="files-list">
            {submissionFiles.map((file) => (
              <div key={file.id} className="file-item">
                <span className="file-icon">{getFileIcon(file.type, file.mime_type)}</span>
                <div className="file-info">
                  {file.type === 'link' || file.type === 'video' ? (
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.url}
                    </a>
                  ) : (
                    <span>{file.file_name}</span>
                  )}
                  {file.file_size && (
                    <p className="file-size">
                      {(file.file_size / 1024).toFixed(2)} KB
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => handleRemoveFile(file.id)}
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="add-file-form">
          <h5>Add File/Link</h5>
          <div className="form-group">
            <label htmlFor="fileType">Type</label>
            <select
              id="fileType"
              name="type"
              value={newFile.type}
              onChange={handleNewFileChange}
              disabled={loading}
            >
              <option value="link">Link</option>
              <option value="video">Video</option>
              <option value="file">File</option>
              <option value="image">Image</option>
            </select>
          </div>

          {(newFile.type === 'link' || newFile.type === 'video') ? (
            <div className="form-group">
              <label htmlFor="fileUrl">URL</label>
              <input
                type="url"
                id="fileUrl"
                value={newFile.url}
                onChange={handleNewFileChange}
                name="url"
                placeholder="https://example.com"
                disabled={loading}
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="file">Upload</label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                accept={newFile.type === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
                disabled={loading}
              />
            </div>
          )}

          <button
            type="button"
            className="btn-add-file"
            onClick={handleAddFile}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add File'}
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancel}
          disabled={loading}
        >
          Close
        </button>
      </div>
    </div>
  );
}
