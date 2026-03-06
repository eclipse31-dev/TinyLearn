import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { AuthContext } from '../../context/AuthContext';
import { Edit, Trash2, MapPin } from 'lucide-react';
import '../../styles/schedules.css';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { API_BASE_URL } from '../../config/api';

export default function SchedulesPage() {
  const [currentView, setCurrentView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    color: '#3B82F6',
    time_of_day: '09:00',
    duration_minutes: 60,
    recurring_days: [], // Array of day names: ['Monday', 'Wednesday', 'Friday']
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch schedules and courses
  useEffect(() => {
    if (token) {
      fetchSchedules();
      fetchCourses();
    }
  }, [currentView, currentDate, token]);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);

    try {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      let endpoint = '';

      if (currentView === 'week') {
        endpoint = `/api/schedules/week?date=${dateStr}`;
      } else if (currentView === 'month') {
        endpoint = `/api/schedules/month?date=${dateStr}`;
      }

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      setSchedules(response.data.data.schedules || []);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err.response?.data?.message || 'Failed to load schedules.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
        withCredentials: true,
      });
      setCourses(response.data.data || response.data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handlePrevious = () => {
    if (currentView === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const handleNext = () => {
    if (currentView === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getSchedulesForDay = (date) => {
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.start_time);
      return isSameDay(scheduleDate, date);
    });
  };

  const getTypeIcon = (type) => {
    const icons = {
      'class': '👨‍🎓',
      'activity': '🎯',
      'assignment': '📝',
      'exam': '📋',
      'event': '🎉',
    };
    return icons[type] || '📅';
  };

  const handleOpenModal = (schedule = null) => {
    if (schedule) {
      // Only allow editing non-activity schedules (class, assignment, exam) if they already exist
      // Activities can be edited
      if (schedule.type === 'activity') {
        setEditingSchedule(schedule);
        const startDateTime = new Date(schedule.start_time);
        const [hours, minutes] = format(startDateTime, 'HH:mm').split(':');
        const duration = (new Date(schedule.end_time) - startDateTime) / 60000;
        
        setFormData({
          title: schedule.title,
          description: schedule.description || '',
          location: schedule.location || '',
          color: schedule.color || '#3B82F6',
          time_of_day: `${hours}:${minutes}`,
          duration_minutes: duration,
          recurring_days: schedule.recurrence_pattern === 'weekly' ? [getDayName(startDateTime)] : [],
        });
      } else {
        // Can't edit class/assignment/exam schedules
        setError('Only activity schedules can be edited manually.');
        return;
      }
    } else {
      setEditingSchedule(null);
      setFormData({
        title: '',
        description: '',
        location: '',
        color: '#3B82F6',
        time_of_day: '09:00',
        duration_minutes: 60,
        recurring_days: [],
      });
    }
    setShowModal(true);
  };

  const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => {
      const days = prev.recurring_days.includes(day)
        ? prev.recurring_days.filter(d => d !== day)
        : [...prev.recurring_days, day];
      return { ...prev, recurring_days: days };
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingSchedule) {
        // Update existing activity schedule
        const now = new Date();
        const [hours, minutes] = formData.time_of_day.split(':');
        const startDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours), parseInt(minutes));
        const endDateTime = new Date(startDateTime.getTime() + formData.duration_minutes * 60000);

        const payload = {
          title: formData.title,
          type: 'activity',
          description: formData.description,
          location: formData.location,
          color: formData.color,
          start_time: startDateTime,
          end_time: endDateTime,
          is_recurring: formData.recurring_days.length > 0,
          recurrence_pattern: formData.recurring_days.length > 0 ? 'weekly' : null,
        };

        await axios.put(`${API_BASE_URL}/api/schedules/${editingSchedule.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        });
      } else {
        // Create new activity schedules for each selected day
        if (formData.recurring_days.length === 0) {
          setError('Please select at least one day for the activity.');
          setLoading(false);
          return;
        }

        const now = new Date();
        const [hours, minutes] = formData.time_of_day.split(':');
        
        const dayNumberMap = {
          'Monday': 1,
          'Tuesday': 2,
          'Wednesday': 3,
          'Thursday': 4,
          'Friday': 5,
          'Saturday': 6,
          'Sunday': 0,
        };

        // Create a schedule for each selected day
        for (const day of formData.recurring_days) {
          const targetDayNumber = dayNumberMap[day];
          const daysUntilTarget = (targetDayNumber - now.getDay() + 7) % 7 || 7;
          
          const startDateTime = new Date(now);
          startDateTime.setDate(startDateTime.getDate() + daysUntilTarget);
          startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          const endDateTime = new Date(startDateTime.getTime() + formData.duration_minutes * 60000);

          const payload = {
            title: formData.title,
            type: 'activity',
            description: formData.description,
            location: formData.location,
            color: formData.color,
            start_time: startDateTime,
            end_time: endDateTime,
            is_recurring: true,
            recurrence_pattern: 'weekly',
            recurrence_end_date: new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months
          };

          await axios.post(`${API_BASE_URL}/api/schedules`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Accept': 'application/json',
            },
            withCredentials: true,
          });
        }
      }

      handleCloseModal();
      await fetchSchedules();
    } catch (err) {
      console.error('Error saving schedule:', err);
      setError(err.response?.data?.message || 'Failed to save schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/api/schedules/${scheduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      await fetchSchedules();
    } catch (err) {
      console.error('Error deleting schedule:', err);
      setError(err.response?.data?.message || 'Failed to delete schedule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="schedules-page">
        <div className="page-header">
          <h1>Schedules</h1>
          <p>Manage your learning schedule and upcoming events.</p>
        </div>

        <div className="schedules-container">
          <div className="schedules-toolbar">
            <div className="view-options">
              <button
                className={`view-btn ${currentView === 'week' ? 'active' : ''}`}
                onClick={() => setCurrentView('week')}
              >
                Week
              </button>
              <button
                className={`view-btn ${currentView === 'month' ? 'active' : ''}`}
                onClick={() => setCurrentView('month')}
              >
                Month
              </button>
            </div>

            <div className="date-navigation">
              <button className="nav-btn" onClick={handlePrevious} title="Previous">
                ←
              </button>
              <button className="nav-btn today-btn" onClick={handleToday}>
                Today
              </button>
              <button className="nav-btn" onClick={handleNext} title="Next">
                →
              </button>
              <p className="current-date">
                {currentView === 'week'
                  ? `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`
                  : format(currentDate, 'MMMM yyyy')
                }
              </p>
            </div>

            <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ New Schedule</button>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
              <button className="alert-close" onClick={() => setError(null)}>×</button>
            </div>
          )}

          <div className="calendar-container">
            {loading ? (
              <div className="loading">Loading schedules...</div>
            ) : currentView === 'week' ? (
              <WeekView 
                currentDate={currentDate} 
                schedules={schedules} 
                getSchedulesForDay={getSchedulesForDay} 
                getTypeIcon={getTypeIcon}
                onEditSchedule={handleOpenModal}
                onDeleteSchedule={handleDeleteSchedule}
              />
            ) : (
              <MonthView 
                currentDate={currentDate} 
                schedules={schedules} 
                getSchedulesForDay={getSchedulesForDay} 
                getTypeIcon={getTypeIcon}
                onEditSchedule={handleOpenModal}
              />
            )}
          </div>
        </div>

        {/* Modal for Create/Edit Schedule */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>×</button>
              </div>

              <form onSubmit={handleSubmitForm} className="schedule-form">
                <div className="form-group">
                  <label htmlFor="title">Activity Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g., Student Club Meeting, Sports Practice"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="time_of_day">Time of Day *</label>
                    <input
                      type="time"
                      id="time_of_day"
                      name="time_of_day"
                      value={formData.time_of_day}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="duration_minutes">Duration (minutes) *</label>
                    <input
                      type="number"
                      id="duration_minutes"
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleFormChange}
                      min="15"
                      max="480"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Days of Week *</label>
                  <div className="days-selection">
                    {daysOfWeek.map(day => (
                      <label key={day} className="day-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.recurring_days.includes(day)}
                          onChange={() => handleDayToggle(day)}
                        />
                        <span>{day.slice(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                  {formData.recurring_days.length === 0 && (
                    <small style={{ color: '#e53e3e', marginTop: '0.5rem', display: 'block' }}>
                      Select at least one day
                    </small>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      placeholder="e.g., Sports Complex, Main Hall"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="color">Color</label>
                    <div className="color-picker">
                      <input
                        type="color"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleFormChange}
                      />
                      <span className="color-code">{formData.color}</span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Add details about this activity"
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading || formData.recurring_days.length === 0}>
                    {loading ? 'Saving...' : editingSchedule ? 'Update Activity' : 'Create Activity'}
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

function WeekView({ currentDate, schedules, getSchedulesForDay, getTypeIcon, onEditSchedule, onDeleteSchedule }) {
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

  const getScheduleTime = (schedule) => {
    const start = new Date(schedule.start_time);
    const end = new Date(schedule.end_time);
    return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
  };

  const getSchedulePosition = (schedule) => {
    const start = new Date(schedule.start_time);
    const hour = start.getHours();
    const minute = start.getMinutes();
    return {
      top: `${(hour - 8 + minute / 60) * 60}px`,
      height: `${((new Date(schedule.end_time) - start) / (1000 * 60))}px`,
    };
  };

  return (
    <div className="week-view">
      <div className="week-header">
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="day-header">
            <div className="day-name">{format(day, 'EEE')}</div>
            <div className="day-date">{format(day, 'd')}</div>
          </div>
        ))}
      </div>

      <div className="week-grid">
        <div className="time-column">
          {hours.map((hour) => (
            <div key={hour} className="time-slot">
              {format(new Date(0, 0, 0, hour), 'HH:mm')}
            </div>
          ))}
        </div>

        {weekDays.map((day) => (
          <div key={day.toISOString()} className="day-column">
            {hours.map((hour) => (
              <div key={`${day.toISOString()}-${hour}`} className="hour-slot" />
            ))}

            <div className="events-container">
              {getSchedulesForDay(day).map((schedule) => (
                <div
                  key={schedule.id}
                  className="event"
                  style={{
                    backgroundColor: schedule.color,
                    ...getSchedulePosition(schedule),
                  }}
                >
                  <div className="event-content">
                    <div className="event-header">
                      <div className="event-icon">{getTypeIcon(schedule.type)}</div>
                      <div className="event-actions">
                        <button 
                          className="event-btn edit-btn" 
                          onClick={() => onEditSchedule(schedule)}
                          title="Edit"
                        >
                          <Edit size={14} color="#ec4899" />
                        </button>
                        <button 
                          className="event-btn delete-btn" 
                          onClick={() => onDeleteSchedule(schedule.id)}
                          title="Delete"
                        >
                          <Trash2 size={14} color="#ef4444" />
                        </button>
                      </div>
                    </div>
                    <div className="event-info">
                      <div className="event-title">{schedule.title}</div>
                      <div className="event-time">{getScheduleTime(schedule)}</div>
                      {schedule.location && <div className="event-location"><MapPin size={12} color="#ec4899" style={{ display: 'inline', marginRight: '4px' }} />{schedule.location}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthView({ currentDate, schedules, getSchedulesForDay, getTypeIcon, onEditSchedule }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDate = startOfWeek(monthStart);
  const paddingDays = [];
  let d = new Date(startDate);
  while (d < monthStart) {
    paddingDays.push(d);
    d = addDays(d, 1);
  }

  const allDays = [...paddingDays, ...monthDays];

  while (allDays.length % 7 !== 0) {
    allDays.push(addDays(allDays[allDays.length - 1], 1));
  }

  return (
    <div className="month-view">
      <div className="month-header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="weekday-header">{day}</div>
        ))}
      </div>

      <div className="month-grid">
        {allDays.map((day) => (
          <div
            key={day.toISOString()}
            className={`day-cell ${!isSameMonth(day, monthStart) ? 'other-month' : ''} ${isSameDay(day, new Date()) ? 'today' : ''}`}
          >
            <div className="day-number">{format(day, 'd')}</div>
            <div className="events-list">
              {getSchedulesForDay(day).slice(0, 3).map((schedule) => (
                <div
                  key={schedule.id}
                  className="event-item"
                  style={{ backgroundColor: schedule.color }}
                  onClick={() => onEditSchedule(schedule)}
                  title={`${schedule.title} - Click to edit`}
                >
                  <span className="event-icon">{getTypeIcon(schedule.type)}</span>
                  <span className="event-title">{schedule.title}</span>
                </div>
              ))}
              {getSchedulesForDay(day).length > 3 && (
                <div className="more-events">+{getSchedulesForDay(day).length - 3} more</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
