import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ModuleCreateModal from '../../components/ModuleCreateModal';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/createForm.css';
import { API_BASE_URL } from '../../config/api';

export default function CreateAssignmentPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    module_ID: '',
    due_date: '',
    status: 'draft',
  });
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load modules for this course
  useEffect(() => {
    fetchModules();
  }, [courseId, token]);

  const fetchModules = async () => {
    setModulesLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/modules`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setModules(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading modules:', err);
    } finally {
      setModulesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModuleCreated = (newModule) => {
    setModules((prev) => [...prev, newModule]);
    setFormData((prev) => ({
      ...prev,
      module_ID: newModule.module_ID || newModule.id,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.module_ID) {
      setError('Please select a module');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          module_ID: parseInt(formData.module_ID),
          due_date: formData.due_date,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.errors?.due_date?.[0] || 'Failed to create assessment');
      }

      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout>
      <div className="create-form-page">
        <div className="form-container">
          <div className="form-header">
            <h1>📝 Create Assessment</h1>
            <p>Add a new assessment to a module in your course</p>
          </div>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <div className="form-label-with-action">
                <label htmlFor="module_ID">Module</label>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="btn-inline-action"
                  disabled={loading}
                >
                  + Create New
                </button>
              </div>
              {modulesLoading ? (
                <p>Loading modules...</p>
              ) : modules.length === 0 ? (
                <div className="form-info-with-action">
                  <p>No modules found. Please create a module to add assessments.</p>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="btn-inline-create"
                    disabled={loading}
                  >
                    ➕ Create Module Now
                  </button>
                </div>
              ) : (
                <select
                  id="module_ID"
                  name="module_ID"
                  value={formData.module_ID}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">-- Select Module --</option>
                  {modules.map((module) => (
                    <option key={module.module_ID} value={module.module_ID}>
                      {module.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="due_date">Due Date</label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                min={today}
                required
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
                <option value="published">Published</option>
                <option value="closed">Closed</option>
              </select>
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
                disabled={loading || !formData.module_ID}
                className="btn-submit"
              >
                {loading ? 'Creating...' : 'Create Assessment'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModuleCreateModal
        courseId={courseId}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onModuleCreated={handleModuleCreated}
      />
    </DashboardLayout>
  );
}
