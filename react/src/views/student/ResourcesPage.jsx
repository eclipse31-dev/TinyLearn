import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { AuthContext } from '../../context/AuthContext';
import { Download, FileText, Video, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import '../../styles/resources.css';
import { API_BASE_URL } from '../../config/api';

export default function ResourcesPage() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all enrolled courses and their materials
  useEffect(() => {
    fetchMaterials();
  }, [token]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      
      // First, get all courses
      const coursesResponse = await fetch(`${API_BASE_URL}/api/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!coursesResponse.ok) {
        throw new Error('Failed to fetch courses');
      }

      const coursesData = await coursesResponse.json();
      
      // Filter only enrolled courses for students
      const enrolledCourses = coursesData.filter(c => c.is_enrolled);
      setCourses(enrolledCourses);

      // Fetch materials for each enrolled course
      const materialsPromises = enrolledCourses.map(course =>
        fetch(`${API_BASE_URL}/api/courses/${course.course_ID}/materials`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }).then(res => res.ok ? res.json() : [])
      );

      const materialsArrays = await Promise.all(materialsPromises);
      
      // Flatten and add course info to each material
      const allMaterials = materialsArrays.flat().map((material, index) => {
        const courseIndex = materialsArrays.findIndex(arr => arr.includes(material));
        return {
          ...material,
          course: enrolledCourses[courseIndex]
        };
      });

      setMaterials(allMaterials);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter materials based on search, type, and course
  useEffect(() => {
    let filtered = materials;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.materials_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.attachment?.file_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(material => material.materials_type === selectedType);
    }

    // Filter by course
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(material => material.course?.course_ID?.toString() === selectedCourse);
    }

    setFilteredMaterials(filtered);
  }, [materials, searchTerm, selectedType, selectedCourse]);

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video size={24} color="#ec4899" />;
      case 'document':
        return <FileText size={24} color="#3b82f6" />;
      case 'link':
        return <LinkIcon size={24} color="#10b981" />;
      default:
        return <FileText size={24} color="#6b7280" />;
    }
  };

  const handleDownload = (material) => {
    if (material.attachment) {
      window.open(
        `${API_BASE_URL}/api/attachments/${material.attachment.attachment_ID}/download`,
        '_blank'
      );
    } else if (material.content && material.materials_type === 'link') {
      window.open(material.content, '_blank');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="resources-page">
          <div className="page-header">
            <h1>Materials</h1>
            <p>Access all your learning materials from enrolled courses.</p>
          </div>
          <div className="loading-spinner">Loading materials...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="resources-page">
        <div className="page-header">
          <h1>Materials</h1>
          <p>Access all your learning materials from enrolled courses.</p>
        </div>

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        <div className="resources-container">
          <div className="resources-toolbar">
            <div className="toolbar-group">
              <input
                type="text"
                placeholder="Search materials..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="toolbar-group">
              <select
                className="filter-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="document">Documents</option>
                <option value="video">Videos</option>
                <option value="link">Links</option>
              </select>
            </div>

            <div className="toolbar-group">
              <select
                className="filter-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course.course_ID} value={course.course_ID}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredMaterials.length === 0 ? (
            <div className="no-resources">
              <p>No materials found. Try adjusting your filters or enroll in courses.</p>
            </div>
          ) : (
            <div className="resources-grid">
              {filteredMaterials.map(material => (
                <div key={material.materials_ID} className="resource-card">
                  <div className="resource-header">
                    <span className="resource-icon">{getMaterialIcon(material.materials_type)}</span>
                    <span className="resource-type">{material.materials_type}</span>
                  </div>

                  <div className="resource-body">
                    <h3 className="resource-title">
                      {material.attachment?.file_name || material.materials_type}
                    </h3>
                    
                    {material.content && (
                      <p className="resource-description">{material.content}</p>
                    )}

                    <div className="resource-meta">
                      <span className="course-name">
                        {material.course?.title || 'Unknown Course'}
                      </span>
                      {material.module?.title && (
                        <span className="module-name">
                          Module: {material.module.title}
                        </span>
                      )}
                      {material.attachment?.file_size && (
                        <span className="file-size">
                          {(material.attachment.file_size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="resource-footer">
                    {(material.attachment || material.materials_type === 'link') && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleDownload(material)}
                      >
                        <Download size={16} style={{ marginRight: '6px' }} />
                        {material.materials_type === 'link' ? 'Open Link' : 'Download'}
                      </button>
                    )}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/courses/${material.course?.course_ID}`)}
                    >
                      View Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="resources-summary">
            <p>Showing {filteredMaterials.length} of {materials.length} materials</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
