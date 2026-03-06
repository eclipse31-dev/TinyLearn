import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { AuthContext } from '../../context/AuthContext';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter,
  Eye,
  MessageCircle,
  Pin,
  Lock,
  Trash2,
  Edit,
  Send
} from 'lucide-react';
import '../../styles/discussion.css';

const API_BASE_URL = 'http://localhost:8000';

export default function DiscussionPage() {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [discussions, setDiscussions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: 'general',
    course_ID: null,
  });

  const isTeacherOrAdmin = user?.roles?.[0]?.role === 'teacher' || user?.roles?.[0]?.role === 'admin';

  useEffect(() => {
    fetchDiscussions();
    fetchCourses();
  }, [token, selectedCourse, selectedCategory, searchTerm]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCourse !== 'all') params.append('course_id', selectedCourse);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`${API_BASE_URL}/api/discussions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDiscussions(data);
      }
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.filter(c => c.is_enrolled));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(newDiscussion),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewDiscussion({ title: '', content: '', category: 'general', course_ID: null });
        fetchDiscussions();
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDiscussion = async (discussionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/discussions/${discussionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedDiscussion(data);
      }
    } catch (error) {
      console.error('Error fetching discussion:', error);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/discussions/${selectedDiscussion.discussion_ID}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ content: replyContent }),
      });

      if (response.ok) {
        setReplyContent('');
        handleViewDiscussion(selectedDiscussion.discussion_ID);
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (discussionId) => {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/discussions/${discussionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        setSelectedDiscussion(null);
        fetchDiscussions();
      }
    } catch (error) {
      console.error('Error deleting discussion:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: '#6b7280',
      question: '#3b82f6',
      announcement: '#ec4899',
      'study-group': '#10b981',
    };
    return colors[category] || '#6b7280';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="discussion-page">
        <div className="page-header">
          <div>
            <h1>Discussion Forum</h1>
            <p>Collaborate and discuss with your peers and teachers.</p>
          </div>
          <button className="btn-create" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            New Discussion
          </button>
        </div>

        <div className="discussion-container">
          {/* Filters */}
          <div className="discussion-toolbar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="question">Question</option>
              <option value="announcement">Announcement</option>
              <option value="study-group">Study Group</option>
            </select>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.course_ID} value={course.course_ID}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Discussion List */}
          {loading ? (
            <div className="loading">Loading discussions...</div>
          ) : selectedDiscussion ? (
            <div className="discussion-detail">
              <button className="btn-back" onClick={() => setSelectedDiscussion(null)}>
                ← Back to Discussions
              </button>

              <div className="discussion-header">
                <div className="discussion-title-section">
                  {selectedDiscussion.is_pinned && <Pin size={20} color="#ec4899" />}
                  {selectedDiscussion.is_locked && <Lock size={20} color="#ef4444" />}
                  <h2>{selectedDiscussion.title}</h2>
                </div>
                <span 
                  className="category-badge"
                  style={{ backgroundColor: getCategoryColor(selectedDiscussion.category) }}
                >
                  {selectedDiscussion.category}
                </span>
              </div>

              <div className="discussion-meta">
                <span>By {selectedDiscussion.user?.FName} {selectedDiscussion.user?.LName}</span>
                <span>•</span>
                <span>{formatDate(selectedDiscussion.created_at)}</span>
                <span>•</span>
                <span><Eye size={16} /> {selectedDiscussion.views} views</span>
                {selectedDiscussion.course && (
                  <>
                    <span>•</span>
                    <span>Course: {selectedDiscussion.course.title}</span>
                  </>
                )}
              </div>

              <div className="discussion-content">
                <p>{selectedDiscussion.content}</p>
              </div>

              {(selectedDiscussion.user_ID === user?.user_ID || isTeacherOrAdmin) && (
                <div className="discussion-actions">
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(selectedDiscussion.discussion_ID)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}

              {/* Replies Section */}
              <div className="replies-section">
                <h3>
                  <MessageCircle size={20} />
                  Replies ({selectedDiscussion.replies?.length || 0})
                </h3>

                {selectedDiscussion.replies?.map(reply => (
                  <div key={reply.reply_ID} className="reply-card">
                    <div className="reply-header">
                      <strong>{reply.user?.FName} {reply.user?.LName}</strong>
                      <span>{formatDate(reply.created_at)}</span>
                    </div>
                    <p>{reply.content}</p>

                    {/* Nested Replies */}
                    {reply.child_replies?.map(childReply => (
                      <div key={childReply.reply_ID} className="reply-card nested">
                        <div className="reply-header">
                          <strong>{childReply.user?.FName} {childReply.user?.LName}</strong>
                          <span>{formatDate(childReply.created_at)}</span>
                        </div>
                        <p>{childReply.content}</p>
                      </div>
                    ))}
                  </div>
                ))}

                {!selectedDiscussion.is_locked && (
                  <form onSubmit={handleReply} className="reply-form">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your reply..."
                      rows="4"
                      required
                    />
                    <button type="submit" disabled={submitting} className="btn-submit">
                      <Send size={16} />
                      {submitting ? 'Posting...' : 'Post Reply'}
                    </button>
                  </form>
                )}

                {selectedDiscussion.is_locked && (
                  <div className="locked-message">
                    <Lock size={20} />
                    This discussion is locked. No new replies can be added.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="discussion-list">
              {discussions.length === 0 ? (
                <div className="empty-state">
                  <MessageSquare size={48} color="#cbd5e0" />
                  <p>No discussions found. Start a new discussion!</p>
                </div>
              ) : (
                discussions.map(discussion => (
                  <div
                    key={discussion.discussion_ID}
                    className="discussion-card"
                    onClick={() => handleViewDiscussion(discussion.discussion_ID)}
                  >
                    <div className="discussion-card-header">
                      <div className="discussion-card-title">
                        {discussion.is_pinned && <Pin size={18} color="#ec4899" />}
                        {discussion.is_locked && <Lock size={18} color="#ef4444" />}
                        <h3>{discussion.title}</h3>
                      </div>
                      <span 
                        className="category-badge"
                        style={{ backgroundColor: getCategoryColor(discussion.category) }}
                      >
                        {discussion.category}
                      </span>
                    </div>

                    <p className="discussion-preview">{discussion.content}</p>

                    <div className="discussion-card-footer">
                      <span className="author">
                        By {discussion.user?.FName} {discussion.user?.LName}
                      </span>
                      <span className="date">{formatDate(discussion.created_at)}</span>
                      <span className="stats">
                        <Eye size={16} /> {discussion.views}
                      </span>
                      <span className="stats">
                        <MessageCircle size={16} /> {discussion.all_replies_count || 0}
                      </span>
                      {discussion.course && (
                        <span className="course-tag">{discussion.course.title}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Create Discussion Modal */}
        {showCreateModal && (
          <>
            <div className="modal-overlay" onClick={() => setShowCreateModal(false)}></div>
            <div className="modal">
              <div className="modal-header">
                <h2>Start New Discussion</h2>
                <button onClick={() => setShowCreateModal(false)} className="btn-close">×</button>
              </div>

              <form onSubmit={handleCreateDiscussion} className="modal-body">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                    placeholder="Enter discussion title..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newDiscussion.category}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
                    required
                  >
                    <option value="general">General</option>
                    <option value="question">Question</option>
                    <option value="announcement">Announcement</option>
                    <option value="study-group">Study Group</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Course (Optional)</label>
                  <select
                    value={newDiscussion.course_ID || ''}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, course_ID: e.target.value || null })}
                  >
                    <option value="">General Discussion</option>
                    {courses.map(course => (
                      <option key={course.course_ID} value={course.course_ID}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                    placeholder="Write your discussion content..."
                    rows="6"
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn-submit">
                    {submitting ? 'Creating...' : 'Create Discussion'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
