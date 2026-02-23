import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import CourseForm from '../components/CourseForm';
import { AuthContext } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:8000';

export default function EditCoursePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!id || id === 'undefined') {
      setError('Invalid course ID');
      setLoading(false);
      return;
    }

    async function loadCourse() {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/courses/${id}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        // Normalize schedule data for form
        const normalizedCourse = {
          ...data,
          header_image_url: data.header_image_url || '',
          has_schedule: data.schedules?.length > 0,
          days_of_week: data.schedules?.map(s => s.day_in_week) || [],
          start_time: data.schedules?.[0]?.start_time?.substring(0, 5) || '',
          end_time: data.schedules?.[0]?.end_time?.substring(0, 5) || '',
          recurrence_pattern: data.schedules?.[0]?.recurrence_pattern || 'weekly',
          recurrence_end_date: data.schedules?.[0]?.recurrence_end_date || '',
        };

        setCourse(normalizedCourse);
      } catch (err) {
        console.error('Load Error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [id, token, navigate]);

  const handleSuccess = (course, action) => {
    if (action === 'deleted') {
      navigate('/courses');
    } else {
      navigate(`/courses/${id}`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: 20, textAlign: 'center' }}>
          Loading course...
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>
          {error || 'Course not found'}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
        <CourseForm
          course={course}
          courseId={course.course_ID}
          token={token}
          onSuccess={handleSuccess}
          onCancel={() => navigate(`/courses/${id}`)}
        />
      </div>
    </DashboardLayout>
  );
}