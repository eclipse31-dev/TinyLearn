import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import '../../styles/resources.css';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/resources', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }

      const data = await response.json();
      setResources(data);
      
      // Extract unique courses from resources
      const uniqueCourses = [...new Set(data.map(r => r.course_id))];
      const courseData = data.reduce((acc, resource) => {
        if (!acc.find(c => c.id === resource.course_id)) {
          acc.push({
            id: resource.course_id,
            title: resource.course?.title || `Course ${resource.course_id}`
          });
        }
        return acc;
      }, []);
      setCourses(courseData);
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter resources based on search, type, and course
  useEffect(() => {
    let filtered = resources;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Filter by course
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(resource => resource.course_id.toString() === selectedCourse);
    }

    setFilteredResources(filtered);
  }, [resources, searchTerm, selectedType, selectedCourse]);

  const getResourceIcon = (type) => {
    switch (type) {
      case 'link':
        return '🔗';
      case 'file':
        return '📄';
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      default:
        return '📌';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleResourceClick = (resource) => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    } else if (resource.file_path) {
      // Download file
      const link = document.createElement('a');
      link.href = `/storage/${resource.file_path}`;
      link.download = resource.file_name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="resources-page">
          <div className="page-header">
            <h1>Resources</h1>
            <p>Access and manage your learning resources.</p>
          </div>
          <div className="loading-spinner">Loading resources...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="resources-page">
        <div className="page-header">
          <h1>Resources</h1>
          <p>Access and manage your learning resources from all courses.</p>
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
                placeholder="Search resources..."
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
                <option value="link">Links</option>
                <option value="file">Files</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
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
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <div className="no-resources">
              <p>No resources found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="resources-grid">
              {filteredResources.map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-header">
                    <span className="resource-icon">{getResourceIcon(resource.type)}</span>
                    <span className="resource-type">{resource.type}</span>
                  </div>

                  <div className="resource-body">
                    <h3 className="resource-title">{resource.title}</h3>
                    
                    {resource.description && (
                      <p className="resource-description">{resource.description}</p>
                    )}

                    <div className="resource-meta">
                      <span className="course-name">
                        {resource.course?.title || `Course ${resource.course_id}`}
                      </span>
                      {resource.file_size && (
                        <span className="file-size">
                          {formatFileSize(resource.file_size)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="resource-footer">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleResourceClick(resource)}
                    >
                      {resource.url ? 'Open' : 'Download'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="resources-summary">
            <p>Showing {filteredResources.length} of {resources.length} resources</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
