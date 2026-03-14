import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { Search, Plus, Trash2, Edit2, Users } from 'lucide-react';
import '../../styles/admin.css';

export default function CourseManagement() {
  const { token } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    description: '',
    instructor_ID: '',
    max_students: 50,
    credits: 3,
    status: 'active',
  });
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, [search, statusFilter, currentPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 10,
      });
      
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const response = await axios.get(
        `http://localhost:8000/api/admin/courses?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCourses(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/users?role=teacher&per_page=100',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInstructors(response.data.data);
    } catch (err) {
      console.error('Error fetching instructors:', err);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8000/api/admin/courses',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setFormData({
        course_code: '',
        course_name: '',
        description: '',
        instructor_ID: '',
        max_students: 50,
        credits: 3,
        status: 'active',
      });
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await axios.delete(
        `http://localhost:8000/api/admin/courses/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting course');
    }
  };

  const handleStatusChange = async (courseId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/courses/${courseId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourses();
    } catch (err) {
      alert('Error updating course status');
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-container">
        <div className="admin-header">
          <h1>Course Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Plus size={20} /> Create Course
          </button>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <div className="filter-group">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-input"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Courses Table */}
        <div className="admin-table-container">
          {loading ? (
            <div className="loading">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="empty-state">No courses found</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Instructor</th>
                  <th>Enrollments</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.course_ID}>
                    <td className="code">{course.course_code}</td>
                    <td>{course.course_name}</td>
                    <td>{course.instructor?.FName} {course.instructor?.LName}</td>
                    <td>
                      <span className="enrollment-count">
                        <Users size={16} /> {course.enrollments_count || 0}
                      </span>
                    </td>
                    <td>
                      <select
                        value={course.status}
                        onChange={(e) => handleStatusChange(course.course_ID, e.target.value)}
                        className="status-select"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                        <option value="draft">Draft</option>
                      </select>
                    </td>
                    <td>{new Date(course.created_at).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        onClick={() => handleDeleteCourse(course.course_ID)}
                        className="action-btn delete-btn"
                        title="Delete Course"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}

        {/* Create Course Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Create New Course</h2>
              <form onSubmit={handleCreateCourse}>
                <div className="form-group">
                  <label>Course Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.course_code}
                    onChange={(e) => setFormData({...formData, course_code: e.target.value})}
                    placeholder="e.g., CS101"
                  />
                </div>

                <div className="form-group">
                  <label>Course Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.course_name}
                    onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                    placeholder="e.g., Introduction to Computer Science"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Course description"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Instructor *</label>
                  <select
                    required
                    value={formData.instructor_ID}
                    onChange={(e) => setFormData({...formData, instructor_ID: e.target.value})}
                  >
                    <option value="">Select an instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.user_ID} value={instructor.user_ID}>
                        {instructor.FName} {instructor.LName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Max Students</label>
                    <input
                      type="number"
                      value={formData.max_students}
                      onChange={(e) => setFormData({...formData, max_students: e.target.value})}
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label>Credits</label>
                    <input
                      type="number"
                      value={formData.credits}
                      onChange={(e) => setFormData({...formData, credits: e.target.value})}
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
