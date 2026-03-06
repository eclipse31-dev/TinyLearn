import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import CourseCard from '../../components/CourseCard';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/courses.css';

const API_URL = 'http://localhost:8000/api';

export default function CoursesPage() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');

  const isTeacherOrAdmin = user?.roles?.[0]?.role === 'teacher' || user?.roles?.[0]?.role === 'admin';

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/courses`, {
          headers: { 
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch courses');

        const data = await res.json();
        setCourses(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadCourses();
    }
  }, [token]);

  useEffect(() => {
    let results = [...courses];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      results = results.filter((course) => {
        const title = course.title?.toLowerCase() || '';
        const desc = course.description?.toLowerCase() || '';
        const instructor = course.creator?.name?.toLowerCase() || '';

        return (
          title.includes(term) ||
          desc.includes(term) ||
          instructor.includes(term)
        );
      });
    }

    results.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'students') {
        return (b.students_enrolled || 0) - (a.students_enrolled || 0);
      }
      return 0;
    });

    setFilteredCourses(results);
  }, [courses, searchTerm, sortBy]);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course?')) return;

    setDeleting(courseId);

    try {
      const res = await fetch(`${API_URL}/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Delete failed');

      setCourses(prev => prev.filter(c => c.course_ID !== courseId));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleEnrollmentChange = () => {
    // Reload courses to get updated enrollment status
    async function reloadCourses() {
      try {
        const res = await fetch(`${API_URL}/courses`, {
          headers: { 
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error('Failed to reload courses:', err);
      }
    }
    reloadCourses();
  };

  return (
   <DashboardLayout>
  <div className="courses-page">
    <div className="page-header">
      <div className="header-content">
        <div>
          <h1>Courses</h1>
          <p>Explore and manage all available courses.</p>
        </div>

        {isTeacherOrAdmin && (
          <button
            className="btn-create-course"
            onClick={() => navigate('/courses/create')}
          >
            <span className="btn-icon">+</span>
            Create Course
          </button>
        )}
      </div>
    </div>

    <div className="courses-container">
      <div className="courses-sidebar">
        <div className="sidebar-header">
          <h3>Filters</h3>
          {(searchTerm || sortBy !== "title") && (
            <button
              className="btn-clear-filters"
              onClick={() => {
                setSearchTerm('');
                setSortBy('title');
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="results-count">
          Showing {filteredCourses.length} of {courses.length} courses
        </div>
      </div>

      <div className="courses-main">
        <div className="courses-header">
          <div className="search-container">
            <input
              type="text"
              id="course-search"
              name="course-search"
              placeholder="Search courses..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                className="btn-clear-search"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>

          <select
            id="sort-courses"
            name="sort-courses"
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Sort by: Title (A-Z)</option>
            <option value="students">Sort by: Most Popular</option>
          </select>
        </div>

        <div className="course-list">
          {loading && <p className="status-message">Loading courses...</p>}
          {error && <p className="status-message error">Error: {error}</p>}

          {!loading && filteredCourses.length === 0 && !error && (
            <div className="empty-state">
              <span className="empty-icon">📚</span>
              <h2>No courses found</h2>
              <p>Try adjusting your search filters.</p>
            </div>
          )}

          {!loading &&
            filteredCourses.map((course) => (
              <CourseCard
                key={course.course_ID}
                course={course}
                onDelete={handleDeleteCourse}
                isDeletingId={deleting}
                onEnrollmentChange={handleEnrollmentChange}
              />
            ))}
        </div>
      </div>
    </div>
  </div>
</DashboardLayout>
  );
}