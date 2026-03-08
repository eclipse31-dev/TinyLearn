// Dummy data for demo mode (no database connection needed)

export const dummyUsers = {
  student: {
    user_ID: 1,
    FName: 'Demo',
    LName: 'Student',
    email: 'demo.student@tinylearn.com',
    username: 'demo_student',
    roles: [{ role: 'student', role_ID: 3 }]
  },
  teacher: {
    user_ID: 2,
    FName: 'Demo',
    LName: 'Teacher',
    email: 'demo.teacher@tinylearn.com',
    username: 'demo_teacher',
    roles: [{ role: 'teacher', role_ID: 2 }]
  },
  admin: {
    user_ID: 3,
    FName: 'Demo',
    LName: 'Admin',
    email: 'demo.admin@tinylearn.com',
    username: 'demo_admin',
    roles: [{ role: 'admin', role_ID: 1 }]
  }
};

export const dummyCourses = [
  {
    course_ID: 1,
    title: 'Introduction to Programming',
    course_code: 'CS101',
    description: 'Learn the basics of programming with Python. This course covers variables, data types, control structures, functions, and basic algorithms.',
    status: 'active',
    created_by: 2,
    header_image_url: null,
    created_at: '2024-01-15T10:00:00Z',
    is_enrolled: true
  },
  {
    course_ID: 2,
    title: 'Web Development Fundamentals',
    course_code: 'WEB201',
    description: 'Build modern web applications with HTML, CSS, and JavaScript. Learn responsive design, DOM manipulation, and modern web APIs.',
    status: 'active',
    created_by: 2,
    header_image_url: null,
    created_at: '2024-01-20T10:00:00Z',
    is_enrolled: true
  },
  {
    course_ID: 3,
    title: 'Data Structures and Algorithms',
    course_code: 'CS202',
    description: 'Master essential data structures and algorithms. Topics include arrays, linked lists, trees, graphs, sorting, and searching.',
    status: 'active',
    created_by: 2,
    header_image_url: null,
    created_at: '2024-02-01T10:00:00Z',
    is_enrolled: true
  },
  {
    course_ID: 4,
    title: 'Database Management Systems',
    course_code: 'DB301',
    description: 'Learn SQL, database design, normalization, and query optimization. Work with MySQL and PostgreSQL.',
    status: 'active',
    created_by: 2,
    header_image_url: null,
    created_at: '2024-02-10T10:00:00Z',
    is_enrolled: false
  }
];

export const dummyAnnouncements = [
  {
    announcement_ID: 1,
    course_id: 1,
    title: 'Welcome to Introduction to Programming!',
    content: 'Welcome to CS101! We are excited to have you here. Please review the syllabus and complete the first assignment by next week.',
    created_at: '2024-03-01T10:00:00Z',
    user: dummyUsers.teacher
  },
  {
    announcement_ID: 2,
    course_id: 1,
    title: 'Assignment 1 Posted',
    content: 'The first assignment on variables and data types has been posted. Due date is March 20th. Good luck!',
    created_at: '2024-03-05T14:30:00Z',
    user: dummyUsers.teacher
  },
  {
    announcement_ID: 3,
    course_id: 2,
    title: 'Midterm Exam Schedule',
    content: 'The midterm exam will be held on March 25th. It will cover HTML, CSS, and basic JavaScript. Study materials are available in the resources section.',
    created_at: '2024-03-10T09:00:00Z',
    user: dummyUsers.teacher
  },
  {
    announcement_ID: 4,
    course_id: 2,
    title: 'New Tutorial Videos Available',
    content: 'I have uploaded new tutorial videos on CSS Flexbox and Grid. Check them out in the materials section!',
    created_at: '2024-03-12T16:00:00Z',
    user: dummyUsers.teacher
  }
];

export const dummyAssignments = [
  {
    assessment_ID: 1,
    course_id: 1,
    title: 'Variables and Data Types',
    description: 'Complete exercises on variables, data types, and basic operations in Python. Submit your code files.',
    type: 'assignment',
    due_date: '2024-03-20T23:59:59Z',
    total_points: 100,
    status: 'published',
    created_at: '2024-03-05T10:00:00Z'
  },
  {
    assessment_ID: 2,
    course_id: 1,
    title: 'Control Structures',
    description: 'Write programs using if-else statements, loops, and nested conditions.',
    type: 'assignment',
    due_date: '2024-03-27T23:59:59Z',
    total_points: 100,
    status: 'published',
    created_at: '2024-03-10T10:00:00Z'
  },
  {
    assessment_ID: 3,
    course_id: 2,
    title: 'Build a Landing Page',
    description: 'Create a responsive landing page using HTML and CSS. Must include navigation, hero section, and footer.',
    type: 'assignment',
    due_date: '2024-03-25T23:59:59Z',
    total_points: 150,
    status: 'published',
    created_at: '2024-03-08T10:00:00Z'
  },
  {
    assessment_ID: 4,
    course_id: 2,
    title: 'JavaScript Calculator',
    description: 'Build a functional calculator using HTML, CSS, and JavaScript.',
    type: 'assignment',
    due_date: '2024-04-01T23:59:59Z',
    total_points: 150,
    status: 'published',
    created_at: '2024-03-15T10:00:00Z'
  }
];

export const dummyMaterials = [
  {
    material_ID: 1,
    course_id: 1,
    title: 'Course Syllabus',
    description: 'Complete course syllabus and schedule for CS101',
    type: 'document',
    file_path: null,
    created_at: '2024-03-01T10:00:00Z'
  },
  {
    material_ID: 2,
    course_id: 1,
    title: 'Python Basics Tutorial',
    description: 'Introduction to Python programming - variables, data types, and operators',
    type: 'video',
    file_path: null,
    created_at: '2024-03-02T10:00:00Z'
  },
  {
    material_ID: 3,
    course_id: 1,
    title: 'Practice Exercises',
    description: 'Set of practice problems for beginners',
    type: 'document',
    file_path: null,
    created_at: '2024-03-03T10:00:00Z'
  },
  {
    material_ID: 4,
    course_id: 2,
    title: 'HTML & CSS Cheat Sheet',
    description: 'Quick reference guide for HTML and CSS',
    type: 'document',
    file_path: null,
    created_at: '2024-03-08T10:00:00Z'
  },
  {
    material_ID: 5,
    course_id: 2,
    title: 'Flexbox Tutorial',
    description: 'Complete guide to CSS Flexbox layout',
    type: 'video',
    file_path: null,
    created_at: '2024-03-12T10:00:00Z'
  }
];

export const dummyGrades = [
  {
    grade_ID: 1,
    assessment_id: 1,
    student_id: 1,
    score: 85,
    feedback: 'Good work! Your code is clean and well-structured. Keep practicing with more complex problems.',
    graded_at: '2024-03-15T10:00:00Z'
  },
  {
    grade_ID: 2,
    assessment_id: 2,
    student_id: 1,
    score: 92,
    feedback: 'Excellent! You have a strong understanding of control structures.',
    graded_at: '2024-03-22T10:00:00Z'
  }
];

export const dummySubmissions = [
  {
    submission_ID: 1,
    assessment_id: 1,
    student_id: 1,
    status: 'graded',
    submitted_at: '2024-03-14T18:30:00Z',
    grade: 85
  },
  {
    submission_ID: 2,
    assessment_id: 2,
    student_id: 1,
    status: 'graded',
    submitted_at: '2024-03-21T20:15:00Z',
    grade: 92
  },
  {
    submission_ID: 3,
    assessment_id: 3,
    student_id: 1,
    status: 'submitted',
    submitted_at: '2024-03-24T22:00:00Z',
    grade: null
  }
];

export const dummyEnrollments = [
  {
    enrollment_ID: 1,
    user_id: 1,
    course_id: 1,
    enrolled_at: '2024-03-01T10:00:00Z',
    status: 'active'
  },
  {
    enrollment_ID: 2,
    user_id: 1,
    course_id: 2,
    enrolled_at: '2024-03-01T10:00:00Z',
    status: 'active'
  },
  {
    enrollment_ID: 3,
    user_id: 1,
    course_id: 3,
    enrolled_at: '2024-03-01T10:00:00Z',
    status: 'active'
  }
];

export const dummyResources = [
  {
    resource_ID: 1,
    course_id: 1,
    title: 'Python Documentation',
    description: 'Official Python documentation',
    type: 'link',
    url: 'https://docs.python.org',
    created_at: '2024-03-01T10:00:00Z'
  },
  {
    resource_ID: 2,
    course_id: 1,
    title: 'Python Tutorial Video Series',
    description: 'Comprehensive video tutorials for beginners',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=example',
    created_at: '2024-03-02T10:00:00Z'
  },
  {
    resource_ID: 3,
    course_id: 2,
    title: 'MDN Web Docs',
    description: 'Complete web development documentation',
    type: 'link',
    url: 'https://developer.mozilla.org',
    created_at: '2024-03-08T10:00:00Z'
  },
  {
    resource_ID: 4,
    course_id: 2,
    title: 'CSS Tricks',
    description: 'Tips and tricks for CSS',
    type: 'link',
    url: 'https://css-tricks.com',
    created_at: '2024-03-09T10:00:00Z'
  }
];

export const dummyDiscussions = [
  {
    discussion_ID: 1,
    course_id: 1,
    user_id: 1,
    title: 'Question about loops',
    content: 'Can someone explain the difference between while and for loops?',
    created_at: '2024-03-10T14:00:00Z',
    user: dummyUsers.student,
    replies: [
      {
        reply_ID: 1,
        discussion_id: 1,
        user_id: 2,
        content: 'Great question! A for loop is used when you know how many times you want to iterate, while a while loop continues until a condition is false.',
        created_at: '2024-03-10T15:30:00Z',
        user: dummyUsers.teacher
      }
    ]
  },
  {
    discussion_ID: 2,
    course_id: 2,
    user_id: 1,
    title: 'Best practices for responsive design?',
    content: 'What are the best practices for making websites responsive?',
    created_at: '2024-03-12T10:00:00Z',
    user: dummyUsers.student,
    replies: []
  }
];

// Demo login credentials
export const demoCredentials = {
  student: {
    email: 'demo.student@tinylearn.com',
    password: 'demo123'
  },
  teacher: {
    email: 'demo.teacher@tinylearn.com',
    password: 'demo123'
  },
  admin: {
    email: 'demo.admin@tinylearn.com',
    password: 'demo123'
  }
};

// Check if login is a demo account
export const isDemoAccount = (email) => {
  return Object.values(demoCredentials).some(cred => cred.email === email);
};

// Get demo user by email
export const getDemoUser = (email) => {
  if (email === demoCredentials.student.email) return dummyUsers.student;
  if (email === demoCredentials.teacher.email) return dummyUsers.teacher;
  if (email === demoCredentials.admin.email) return dummyUsers.admin;
  return null;
};

// Check if currently in demo mode
export const isDemoMode = () => {
  return localStorage.getItem('demoMode') === 'true';
};
