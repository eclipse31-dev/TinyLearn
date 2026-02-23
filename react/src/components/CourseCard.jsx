import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/courseCard.css';

export default function CourseCard({ course, onDelete, isDeletingId }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const courseId = course.course_ID;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="course-menu" ref={menuRef}>
          <button
            className="menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            ⋯
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/courses/${courseId}/edit`);
                }}
              >
                ✏️ Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(courseId);
                }}
                disabled={isDeletingId === courseId}
              >
                🗑️ {isDeletingId === courseId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}