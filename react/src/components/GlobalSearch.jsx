import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/search.css';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ courses: [], resources: [], users: [] });
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ courses: [], resources: [], users: [] });
      return;
    }

    const debounce = setTimeout(async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [coursesRes, resourcesRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/courses?search=${query}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8000/api/resources?search=${query}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setResults({
          courses: coursesRes.data.data?.slice(0, 5) || [],
          resources: resourcesRes.data.slice(0, 5) || [],
          users: []
        });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (type, id) => {
    setIsOpen(false);
    setQuery('');
    if (type === 'course') navigate(`/courses/${id}`);
    if (type === 'resource') navigate('/resources');
  };

  if (!isOpen) {
    return (
      <button className="search-trigger" onClick={() => setIsOpen(true)}>
        <span className="search-icon">🔍</span>
        <span className="search-text">Search...</span>
        <kbd className="search-kbd">Ctrl K</kbd>
      </button>
    );
  }

  return (
    <div className="search-overlay" onClick={() => setIsOpen(false)}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()} ref={searchRef}>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search courses, resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {loading && <span className="search-loading">⏳</span>}
        </div>

        <div className="search-results">
          {query.length < 2 ? (
            <div className="search-hint">
              <p>Type at least 2 characters to search</p>
              <div className="search-shortcuts">
                <kbd>↑</kbd> <kbd>↓</kbd> to navigate
                <kbd>Enter</kbd> to select
                <kbd>Esc</kbd> to close
              </div>
            </div>
          ) : (
            <>
              {results.courses.length > 0 && (
                <div className="search-section">
                  <h4 className="search-section-title">📚 Courses</h4>
                  {results.courses.map((course) => (
                    <button
                      key={course.course_ID}
                      className="search-item"
                      onClick={() => handleSelect('course', course.course_ID)}
                    >
                      <div className="search-item-content">
                        <span className="search-item-title">{course.title}</span>
                        <span className="search-item-subtitle">{course.course_code}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.resources.length > 0 && (
                <div className="search-section">
                  <h4 className="search-section-title">📁 Resources</h4>
                  {results.resources.map((resource) => (
                    <button
                      key={resource.id}
                      className="search-item"
                      onClick={() => handleSelect('resource', resource.id)}
                    >
                      <div className="search-item-content">
                        <span className="search-item-title">{resource.title}</span>
                        <span className="search-item-subtitle">{resource.type}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.courses.length === 0 && results.resources.length === 0 && !loading && (
                <div className="search-empty">
                  <p>No results found for "{query}"</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
