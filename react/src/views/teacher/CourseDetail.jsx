import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import ClassList from '../../components/ClassList';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, BookOpen, Users, MapPin, Edit, Trash2, Copy, Check } from 'lucide-react';
import '../../styles/courseDetail.css';
import { API_BASE_URL } from '../../config/api';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('announcements');
  const [showClassList, setShowClassList] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [copied, setCopied] = useState(false);

  // Check if user is teacher or admin
  const canEdit = user?.roles?.[0]?.role === 'teacher' || user?.roles?.[0]?.role === 'admin';

  const handleCopyClassCode = () => {
    if (course?.course_code) {
      navigator.clipboard.writeText(course.course_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('Invalid course ID');
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const headers = token
          ? { Authorization: `Bearer ${token}`, Accept: 'application/json' }
          : { Accept: 'application/json' };

        const courseRes = await axios.get(`${API_BASE_URL}/api/courses/${id}`, { headers });
        const courseData = courseRes.data;
        setCourse(courseData);

        const [annRes, assRes, matRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/courses/${id}/announcements`, { headers, validateStatus: () => true }),
          axios.get(`${API_BASE_URL}/api/courses/${id}/assignments`, { headers, validateStatus: () => true }),
          axios.get(`${API_BASE_URL}/api/courses/${id}/materials`, { headers, validateStatus: () => true })
        ]);

        if (annRes.status === 200) {
          const data = annRes.data;
          setAnnouncements(Array.isArray(data) ? data : []);
        }

        if (assRes.status === 200) {
          const data = assRes.data;
          setAssignments(Array.isArray(data) ? data : []);
        }

        if (matRes.status === 200) {
          const data = matRes.data;
          setMaterials(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error loading course:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, token]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (time) => {
    if (!time) return '';
    if (typeof time === 'string') {
      return time.substring(0, 5);
    }
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    setDeleting(announcementId);
    try {
      await axios.delete(`${API_BASE_URL}/api/announcements/${announcementId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(prev => prev.filter(a => a.announcement_ID !== announcementId));
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    setDeleting(assignmentId);
    try {
      await axios.delete(`${API_BASE_URL}/api/assessments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(prev => prev.filter(a => a.assessment_ID !== assignmentId));
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    setDeleting(materialId);
    try {
      await axios.delete(`${API_BASE_URL}/api/materials/${materialId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterials(prev => prev.filter(m => m.materials_ID !== materialId));
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Failed to delete material');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="course-detail-loading">
          <p>Loading course...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div className="course-detail-error">
          <p>{error || 'Course not found'}</p>
          <button onClick={() => navigate('/courses')}>
            <ArrowLeft size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Back to Courses
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="course-detail-page">

        <div className="course-header-section">
          <div className="course-header-top">
            <div>
              <h1>{course.title}</h1>
              <div className="course-meta">
                <span className="class-code-container">
                  <BookOpen size={16} style={{ display: 'inline', marginRight: '4px', color: '#ec4899' }} />
                  Class Code: <strong>{course.course_code || 'N/A'}</strong>
                  {canEdit && course.course_code && (
                    <button 
                      className="btn-copy-code"
                      onClick={handleCopyClassCode}
                      title="Copy class code"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </span>
                <span>
                  <Users size={16} style={{ display: 'inline', marginRight: '4px', color: '#ec4899' }} />
                  {course.students_enrolled || 0} Students
                </span>
                <span>
                  <MapPin size={16} style={{ display: 'inline', marginRight: '4px', color: '#ec4899' }} />
                  Status: {course.status || 'draft'}
                </span>
              </div>
            </div>
            {canEdit && (
              <div className="course-actions">
                <button onClick={() => navigate(`/courses/${id}/edit`)} className="btn-edit">
                  <Edit size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="course-description">
          <p>{course.description || 'No description provided.'}</p>
        </div>

        {/* View Class Button */}
        <div className="view-class-section">
          <button 
            className="btn-view-class"
            onClick={() => setShowClassList(true)}
          >
            <Users size={20} style={{ marginRight: '8px' }} />
            View Class
          </button>
        </div>

        {course.schedules && course.schedules.length > 0 && (
          <div className="course-schedules">
            <h3>Schedule</h3>
            <div className="schedules-list">
              {course.schedules.map(schedule => (
                <div key={schedule.schedule_ID} className="schedule-item">
                  <strong>{schedule.day_in_week}</strong>
                  <span>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
                  {schedule.recurrence_pattern && (
                    <span className="recurrence">({schedule.recurrence_pattern})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="course-tabs">
          {['announcements', 'assignments', 'materials'].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          {canEdit && (
            <button 
              className="btn-create-item"
              onClick={() => navigate(`/courses/${id}/${activeTab}/create`)}
            >
              + Add {activeTab.slice(0, -1)}
            </button>
          )}
        </div>

        <div className="course-content">

          {activeTab === 'announcements' &&
            (announcements.length === 0 ? (
              <p>No announcements yet</p>
            ) : (
              announcements.map(a => (
                <div key={a.announcement_ID} className="announcement-card">
                  <div className="card-header">
                    <div>
                      <h3>{a.title}</h3>
                      <span>{formatDate(a.created_at)}</span>
                    </div>
                    {canEdit && (
                      <button
                        className="btn-delete-item"
                        onClick={() => handleDeleteAnnouncement(a.announcement_ID)}
                        disabled={deleting === a.announcement_ID}
                      >
                        <Trash2 size={16} />
                        {deleting === a.announcement_ID ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                  <p>{a.content}</p>
                </div>
              ))
            ))}

          {activeTab === 'assignments' &&
            (assignments.length === 0 ? (
              <p>No assessments yet</p>
            ) : (
              assignments.map(a => (
                <div key={a.assessment_ID} className="assignment-card">
                  <div className="card-header">
                    <div>
                      <h3>Assessment</h3>
                      <span>Due {formatDate(a.due_date)}</span>
                      <span className="status-badge">{a.status}</span>
                    </div>
                    {canEdit && (
                      <button
                        className="btn-delete-item"
                        onClick={() => handleDeleteAssignment(a.assessment_ID)}
                        disabled={deleting === a.assessment_ID}
                      >
                        <Trash2 size={16} />
                        {deleting === a.assessment_ID ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ))}

          {activeTab === 'materials' &&
            (materials.length === 0 ? (
              <p>No materials yet</p>
            ) : (
              materials.map(m => (
                <div key={m.materials_ID || m.id} className="resource-card">
                  <div className="card-header">
                    <div>
                      <h3>Material: {m.materials_type}</h3>
                    </div>
                    {canEdit && (
                      <button
                        className="btn-delete-item"
                        onClick={() => handleDeleteMaterial(m.materials_ID)}
                        disabled={deleting === m.materials_ID}
                      >
                        <Trash2 size={16} />
                        {deleting === m.materials_ID ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                  {m.content && <p>{m.content}</p>}
                  {m.attachment && (
                    <div className="resource-attachment">
                      <a
                        href={`http://localhost:8000/api/attachments/${m.attachment.attachment_ID}/download`}
                        download
                        className="btn-download"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(
                            `http://localhost:8000/api/attachments/${m.attachment.attachment_ID}/download`,
                            '_blank'
                          );
                        }}
                      >
                        📎 Download: {m.attachment.file_name}
                      </a>
                      <span className="file-size">
                        ({(m.attachment.file_size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                </div>
              ))
            ))}
        </div>

        <div className="course-footer">
          <button onClick={() => navigate('/courses')}>
            <ArrowLeft size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Back to Courses
          </button>
        </div>

      </div>

      {/* ClassList Modal */}
      <ClassList 
        courseId={id}
        isOpen={showClassList}
        onClose={() => setShowClassList(false)}
      />
    </DashboardLayout>
  );
}