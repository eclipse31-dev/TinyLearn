import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, MoreVertical, UserMinus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/courseCard.css';

export default function CourseCard({ course, onDelete, isDeletingId, onEnrollmentChange }) {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(course.is_enrolled || false);
  const [enrolling, setEnrolling] = useState(false);
  const menuRef = useRef(null);

  const courseId = course.course_ID;

  // Check if user is teacher or admin
  const canEdit = user?.roles?.[0]?.role === 'teacher' || user?.roles?.[0]?.role === 'admin';
  const isStudent = user?.roles?.[0]?.role === 'student';

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEnroll = async (e) => {
    e.stopPropagation();
    setEnrolling(true);

    try {
      const endpoint = `http://localhost:8000/api/courses/${courseId}/enroll`;

      await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsEnrolled(true);
      if (onEnrollmentChange) {
        onEnrollmentChange();
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert(error.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async (e) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to unenroll from this course?')) {
      return;
    }

    setEnrolling(true);

    try {
      const endpoint = `http://localhost:8000/api/courses/${courseId}/unenroll`;

      await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsEnrolled(false);
      if (onEnrollmentChange) {
        onEnrollmentChange();
      }
    } catch (error) {
      console.error('Unenrollment error:', error);
      alert(error.response?.data?.message || 'Failed to unenroll from course');
    } finally {
      setEnrolling(false);
    }
  };

  const headerImageUrl =
    course.header_image_url || '/course-default.jpg';

  return (
    <div className="course-card" onClick={() => navigate(`/courses/${courseId}`)}>
      <div className="course-card-header">
        <img
          src={headerImageUrl}
          alt={course.title}
          className="course-header-image"
          onError={(e) => (e.target.src = '/course-default.jpg')}
        />
      </div>

      <div className="course-card-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">
          {course.description || 'No description available'}
        </p>

        <div className="course-meta">
          <span>{course.students_enrolled || 0} Students</span>
          <span>Status: {course.status}</span>
        </div>
      </div>

      <div className="course-card-footer">
        {isStudent && !isEnrolled && (
          <button
            className="btn-enroll"
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? 'Enrolling...' : 'Enroll in Course'}
          </button>
        )}

        {isStudent && isEnrolled && (
          <span className="enrolled-badge">✓ Enrolled</span>
        )}

        <div className="course-menu" ref={menuRef}>
          <button
            className="menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <MoreVertical size={20} color="#6b7280" />
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              {canEdit && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${courseId}/edit`);
                    }}
                  >
                    <Edit size={16} color="#ec4899" style={{ display: 'inline', marginRight: '6px' }} />
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(courseId);
                    }}
                    disabled={isDeletingId === courseId}
                  >
                    <Trash2 size={16} color="#ef4444" style={{ display: 'inline', marginRight: '6px' }} />
                    {isDeletingId === courseId ? 'Deleting...' : 'Delete'}
                  </button>
                </>
              )}
              
              {isStudent && isEnrolled && (
                <button
                  onClick={handleUnenroll}
                  disabled={enrolling}
                  className="unenroll-btn"
                >
                  {enrolling ? (
                    'Processing...'
                  ) : (
                    <>
                      <UserMinus size={16} color="#ef4444" style={{ display: 'inline', marginRight: '6px' }} />
                      Unenroll Course
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}