// Mock API service for demo mode
import {
  dummyCourses,
  dummyAnnouncements,
  dummyAssignments,
  dummyMaterials,
  dummyGrades,
  dummyEnrollments,
  dummyResources,
  dummyDiscussions,
  dummySubmissions,
  dummyUsers,
  dummySchedules,
  dummyOnlineHours,
  dummyActivityLogs
} from '../data/dummyData';

// Check if in demo mode
const isDemoMode = () => {
  return localStorage.getItem('demoMode') === 'true';
};

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockApi = {
  // Courses
  getCourses: async () => {
    if (!isDemoMode()) return null;
    await delay();
    return { data: { courses: dummyCourses } };
  },

  getCourse: async (id) => {
    if (!isDemoMode()) return null;
    await delay();
    const course = dummyCourses.find(c => c.course_ID === parseInt(id));
    return { data: { course } };
  },

  // Announcements
  getAnnouncements: async (courseId) => {
    if (!isDemoMode()) return null;
    await delay();
    const announcements = courseId
      ? dummyAnnouncements.filter(a => a.course_id === parseInt(courseId))
      : dummyAnnouncements;
    return { data: { announcements } };
  },

  // Assignments
  getAssignments: async (courseId) => {
    if (!isDemoMode()) return null;
    await delay();
    const assignments = courseId
      ? dummyAssignments.filter(a => a.course_id === parseInt(courseId))
      : dummyAssignments;
    return { data: { assignments } };
  },

  getAssignment: async (id) => {
    if (!isDemoMode()) return null;
    await delay();
    const assignment = dummyAssignments.find(a => a.assessment_ID === parseInt(id));
    return { data: { assignment } };
  },

  // Materials
  getMaterials: async (courseId) => {
    if (!isDemoMode()) return null;
    await delay();
    const materials = courseId
      ? dummyMaterials.filter(m => m.course_id === parseInt(courseId))
      : dummyMaterials;
    return { data: { materials } };
  },

  // Resources
  getResources: async (courseId) => {
    if (!isDemoMode()) return null;
    await delay();
    const resources = courseId
      ? dummyResources.filter(r => r.course_id === parseInt(courseId))
      : dummyResources;
    return { data: { resources } };
  },

  // Grades
  getGrades: async (studentId) => {
    if (!isDemoMode()) return null;
    await delay();
    const grades = studentId
      ? dummyGrades.filter(g => g.student_id === parseInt(studentId))
      : dummyGrades;
    return { data: { grades } };
  },

  // Submissions
  getSubmissions: async (studentId) => {
    if (!isDemoMode()) return null;
    await delay();
    const submissions = studentId
      ? dummySubmissions.filter(s => s.student_id === parseInt(studentId))
      : dummySubmissions;
    return { data: { submissions } };
  },

  // Enrollments
  getEnrollments: async (userId) => {
    if (!isDemoMode()) return null;
    await delay();
    const enrollments = userId
      ? dummyEnrollments.filter(e => e.user_id === parseInt(userId))
      : dummyEnrollments;
    
    // Add course details to enrollments
    const enrollmentsWithCourses = enrollments.map(enrollment => ({
      ...enrollment,
      course: dummyCourses.find(c => c.course_ID === enrollment.course_id)
    }));
    
    return { data: { enrollments: enrollmentsWithCourses } };
  },

  // Discussions
  getDiscussions: async (courseId) => {
    if (!isDemoMode()) return null;
    await delay();
    const discussions = courseId
      ? dummyDiscussions.filter(d => d.course_id === parseInt(courseId))
      : dummyDiscussions;
    return { data: { discussions } };
  },

  // Schedules
  getSchedules: async (params) => {
    if (!isDemoMode()) return null;
    await delay();
    return { data: { schedules: dummySchedules } };
  },

  // Online hours data
  getOnlineHours: async (period = 'week') => {
    if (!isDemoMode()) return null;
    await delay();
    return { data: { hours: dummyOnlineHours[period] || dummyOnlineHours.week } };
  },

  // Activity logs
  getActivityLogs: async (userId) => {
    if (!isDemoMode()) return null;
    await delay();
    return { data: { logs: dummyActivityLogs } };
  },

  // Dashboard stats
  getDashboardStats: async (userId, role) => {
    if (!isDemoMode()) return null;
    await delay();
    
    if (role === 'student') {
      return {
        data: {
          enrolled_courses: dummyEnrollments.filter(e => e.user_id === userId).length,
          pending_assignments: dummyAssignments.length - dummySubmissions.length,
          submitted_assignments: dummySubmissions.filter(s => s.status === 'graded').length,
          average_grade: 88.5
        }
      };
    } else if (role === 'teacher') {
      return {
        data: {
          my_courses: dummyCourses.length,
          total_students: 45,
          pending_submissions: 12,
          total_assignments: dummyAssignments.length
        }
      };
    } else if (role === 'admin') {
      return {
        data: {
          total_users: 150,
          total_courses: dummyCourses.length,
          total_teachers: 8,
          total_students: 142
        }
      };
    }
  },

  // Online hours chart data
  getOnlineHoursChart: async () => {
    if (!isDemoMode()) return null;
    await delay();
    return {
      data: [
        { day: 'Mon', hours: 4.5, users_count: 12 },
        { day: 'Tue', hours: 5.2, users_count: 15 },
        { day: 'Wed', hours: 3.8, users_count: 10 },
        { day: 'Thu', hours: 6.1, users_count: 18 },
        { day: 'Fri', hours: 5.5, users_count: 16 },
        { day: 'Sat', hours: 2.3, users_count: 8 },
        { day: 'Sun', hours: 3.2, users_count: 9 }
      ]
    };
  },

  // Online hours stats
  getOnlineHoursStats: async () => {
    if (!isDemoMode()) return null;
    await delay();
    return {
      data: {
        active_users: 5,
        users: [
          { user_id: 1, name: 'Demo Student', role: 'student', total_hours: 12.5, sessions_count: 8 },
          { user_id: 2, name: 'Demo Teacher', role: 'teacher', total_hours: 18.3, sessions_count: 12 },
          { user_id: 4, name: 'John Doe', role: 'student', total_hours: 10.2, sessions_count: 6 },
          { user_id: 5, name: 'Jane Smith', role: 'teacher', total_hours: 15.7, sessions_count: 10 },
          { user_id: 6, name: 'Alice Johnson', role: 'student', total_hours: 8.9, sessions_count: 5 },
          { user_id: 7, name: 'Bob Wilson', role: 'student', total_hours: 7.4, sessions_count: 4 },
          { user_id: 8, name: 'Carol Davis', role: 'student', total_hours: 6.2, sessions_count: 3 },
          { user_id: 9, name: 'David Brown', role: 'student', total_hours: 5.8, sessions_count: 3 },
          { user_id: 10, name: 'Emma Taylor', role: 'student', total_hours: 4.5, sessions_count: 2 },
          { user_id: 11, name: 'Frank Miller', role: 'student', total_hours: 3.9, sessions_count: 2 }
        ]
      }
    };
  },

  // Users (for admin)
  getUsers: async () => {
    if (!isDemoMode()) return null;
    await delay();
    return { 
      data: { 
        users: [
          dummyUsers.student,
          dummyUsers.teacher,
          dummyUsers.admin,
          {
            user_ID: 4,
            FName: 'John',
            LName: 'Doe',
            email: 'john.doe@example.com',
            username: 'johndoe',
            roles: [{ role: 'student', role_ID: 3 }]
          },
          {
            user_ID: 5,
            FName: 'Jane',
            LName: 'Smith',
            email: 'jane.smith@example.com',
            username: 'janesmith',
            roles: [{ role: 'teacher', role_ID: 2 }]
          }
        ] 
      } 
    };
  },

  // Create/Update/Delete operations (just return success in demo mode)
  createCourse: async (data) => {
    if (!isDemoMode()) return null;
    await delay();
    return { data: { message: 'Course created successfully (Demo Mode)', course: { ...data, course_ID: Date.now() } } };
  },

  updateCourse: async (id, data) => {
    if (!isDemoMode()) return null;
    await delay();
    return { data: { message: 'Course updated successfully (Demo Mode)' } };
  },

  deleteCourse: async (id) => {
    if (!isDemoMode()) return null;
    await delay();
    return { data: { message: 'Course deleted successfully (Demo Mode)' } };
  },

  createAnnouncement: async (data) => {
    if (!isDemoMode()) return null;
    await delay();
    return { data: { message: 'Announcement created successfully (Demo Mode)' } };
  },

  createAssignment: async (data) => {
    if (!isDemoMode()) return null;
    await delay();
    return { data: { message: 'Assignment created successfully (Demo Mode)' } };
  },

  submitAssignment: async (data) => {
    if (!isDemoMode()) return null;
    await delay();
    return { data: { message: 'Assignment submitted successfully (Demo Mode)' } };
  },

  gradeSubmission: async (id, data) => {
    if (!isDemoMode()) return null;
    await delay();
    return { data: { message: 'Submission graded successfully (Demo Mode)' } };
  }
};
