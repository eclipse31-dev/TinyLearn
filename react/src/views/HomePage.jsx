import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Dashboard as AdminDashboard } from './admin';
import { Dashboard as TeacherDashboard } from './teacher';
import { Dashboard as StudentDashboard } from './student';

export default function HomePage() {
  const { user, token, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for AuthContext to finish loading
    if (loading) {
      return;
    }

    // Check if user is authenticated
    const checkAuth = () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (!savedToken || !savedUser) {
        navigate('/login');
        return;
      }
      
      setIsReady(true);
    };

    checkAuth();
  }, [loading, navigate]);

  if (loading || !isReady) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!user) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Redirecting...</div>;
  }

  // Get role from user object
  let role = 'student';
  
  if (user.roles && Array.isArray(user.roles)) {
    if (user.roles.length > 0) {
      role = typeof user.roles[0] === 'string' ? user.roles[0] : user.roles[0].role;
    }
  }

  // Route to appropriate dashboard based on role
  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <StudentDashboard />;
  }
}
