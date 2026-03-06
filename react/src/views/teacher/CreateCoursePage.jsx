import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Image, Upload } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/createCourse.css';
import { API_BASE_URL } from '../../config/api';

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
  title: '',
  description: '',
  header_image_url: '',
  has_schedule: false,
  days_of_week: [],
  start_time: '',
  end_time: '',
  recurrence_pattern: 'weekly',
  recurrence_end_date: '',
  });

  useEffect(() => {
    // Set default recurrence end date 6 months from today
    const today = new Date();
    const sixMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
    setFormData(prev => ({
      ...prev,
      recurrence_end_date: sixMonthsFromNow.toISOString().split('T')[0],
    }));
  }, []);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleScheduleChange = (day) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation: if schedule is enabled, ensure days, start, and end times exist
    if (formData.has_schedule) {
      if (!formData.days_of_week.length) {
        setError('Please select at least one day of the week.');
        setLoading(false);
        return;
      }
      if (!formData.start_time || !formData.end_time) {
        setError('Please provide start and end times for the schedule.');
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        duration_minutes: parseInt(formData.duration_minutes) || 0,
        has_schedule: formData.has_schedule ? 1 : 0,
        days_of_week: formData.has_schedule ? formData.days_of_week : [],
        start_time: formData.has_schedule ? formData.start_time : null,
        end_time: formData.has_schedule ? formData.end_time : null,
        long_description: formData.long_description || formData.description,
      };

      await axios.post(`${API_BASE_URL}/api/courses`, payload, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      alert('Course created successfully!');
      navigate('/courses');
    } catch (err) {
      console.error('Submission Error:', err.response?.data);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(' ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1'];

  return (
    <DashboardLayout>
      <div className="create-course-page">
        <div className="page-header">
          <h1>Create New Course</h1>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="course-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-section">
              <h2>Basic Information</h2>
              <div className="form-group">
                <label>Course Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Instructor Name *</label>
                  <input type="text" name="instructor" value={formData.instructor} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Duration (min) *</label>
                  <input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Description (Short) *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} maxLength="500" rows="3" required />
              </div>
            </div>

            <div className="form-group">
              <label>
                <Image size={18} style={{ display: 'inline', marginRight: '6px', color: '#ec4899' }} />
                Header Image
              </label>
              
              {/* URL Input */}
              <input
                type="text"
                name="header_image_url"
                value={formData.header_image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg or paste image URL"
              />
              
              {/* OR Divider */}
              <div style={{ textAlign: 'center', margin: '12px 0', color: '#9ca3af', fontSize: '14px', fontWeight: '600' }}>
                OR
              </div>
              
              {/* File Upload Button */}
              <label htmlFor="header_image_file" className="upload-image-btn">
                <Upload size={18} style={{ display: 'inline', marginRight: '8px' }} />
                Upload Image from Computer
                <input
                  type="file"
                  id="header_image_file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Create a preview URL
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData(prev => ({ ...prev, header_image_url: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </label>
              
              {/* Image Preview */}
              {formData.header_image_url && (
                <div style={{ marginTop: '12px' }}>
                  <img 
                    src={formData.header_image_url} 
                    alt="Header preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px', 
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '2px solid #e2e8f0'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <small className="form-hint">Upload an image or paste an image URL (JPG, PNG, GIF)</small>
            </div>

            <div className="form-section">
              <h2>Class Schedule</h2>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={formData.has_schedule} 
                    onChange={(e) => setFormData(prev => ({ ...prev, has_schedule: e.target.checked }))} 
                  />
                  Enable recurring schedule
                </label>
              </div>

              {formData.has_schedule && (
                <>
                  <div className="form-group">
                    <label>Days of Week *</label>
                    <div className="days-selection">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <label key={day} className="day-checkbox">
                          <input
                            type="checkbox"
                            checked={formData.days_of_week.includes(day)}
                            onChange={() => handleScheduleChange(day)}
                          />
                          <span>{day.slice(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Time *</label>
                      <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>End Time *</label>
                      <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Recurrence</label>
                      <select name="recurrence_pattern" value={formData.recurrence_pattern} onChange={handleChange}>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input type="date" name="recurrence_end_date" value={formData.recurrence_end_date} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Color Tag</label>
                    <div className="color-picker">
                      {colorOptions.map(c => (
                        <button 
                          key={c} 
                          type="button" 
                          className={`color-option ${formData.color === c ? 'active' : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setFormData(prev => ({ ...prev, color: c }))}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/courses')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}