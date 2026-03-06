import { useState, useEffect, useContext } from 'react';
import { Users, GraduationCap, Briefcase, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/classList.css';

export default function ClassList({ courseId, isOpen, onClose }) {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (isOpen && courseId) {
      fetchClassList();
    }
  }, [isOpen, courseId]);

  const fetchClassList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/courses/${courseId}/class-list`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setStudents(response.data.students || []);
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error('Error fetching class list:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="class-list-modal">
        <div className="modal-header">
          <h2>
            <Users size={24} color="#ec4899" style={{ marginRight: '8px' }} />
            Class List
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading">Loading class list...</div>
          ) : (
            <>
              {/* Teachers Section */}
              <div className="list-section">
                <h3>
                  <Briefcase size={20} color="#ec4899" style={{ marginRight: '8px' }} />
                  Teachers ({teachers.length})
                </h3>
                {teachers.length === 0 ? (
                  <p className="empty-message">No teachers assigned</p>
                ) : (
                  <div className="members-list">
                    {teachers.map((teacher) => (
                      <div key={teacher.user_ID} className="member-item teacher">
                        <div className="member-avatar">
                          {teacher.FName?.charAt(0)}{teacher.LName?.charAt(0)}
                        </div>
                        <div className="member-info">
                          <div className="member-name">
                            {teacher.FName} {teacher.LName}
                          </div>
                          <div className="member-email">{teacher.email}</div>
                        </div>
                        <span className="member-badge teacher-badge">Teacher</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Students Section */}
              <div className="list-section">
                <h3>
                  <GraduationCap size={20} color="#3b82f6" style={{ marginRight: '8px' }} />
                  Students ({students.length})
                </h3>
                {students.length === 0 ? (
                  <p className="empty-message">No students enrolled</p>
                ) : (
                  <div className="members-list">
                    {students.map((student) => (
                      <div key={student.user_ID} className="member-item student">
                        <div className="member-avatar">
                          {student.FName?.charAt(0)}{student.LName?.charAt(0)}
                        </div>
                        <div className="member-info">
                          <div className="member-name">
                            {student.FName} {student.LName}
                          </div>
                          <div className="member-email">{student.email}</div>
                        </div>
                        <span className="member-badge student-badge">Student</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
