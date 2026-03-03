import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import echo from '../services/echo';
import ProgressBar from './ProgressBar';
import '../styles/live-progress.css';

export default function LiveProgressTracker({ courseId }) {
  const [progress, setProgress] = useState(0);
  const [completedItems, setCompletedItems] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !courseId) return;

    // Listen for progress updates
    echo.private(`user.${user.user_ID}`)
      .listen('CourseProgressUpdated', (e) => {
        if (e.courseId === courseId) {
          setProgress(e.progress);
          setCompletedItems(e.completed);
          setTotalItems(e.total);
        }
      });

    // Fetch initial progress
    fetchProgress();

    return () => {
      echo.leave(`user.${user.user_ID}`);
    };
  }, [user, courseId]);

  const fetchProgress = async () => {
    // Mock data for now
    setProgress(65);
    setCompletedItems(13);
    setTotalItems(20);
  };

  return (
    <div className="live-progress-tracker">
      <div className="progress-header">
        <h4>Your Progress</h4>
        <span className="progress-stats">
          {completedItems} / {totalItems} completed
        </span>
      </div>
      <ProgressBar 
        progress={progress}
        size="large"
        color={progress === 100 ? 'success' : 'primary'}
      />
      <div className="progress-milestones">
        <div className={`milestone ${progress >= 25 ? 'completed' : ''}`}>
          <span className="milestone-icon">🎯</span>
          <span className="milestone-label">25%</span>
        </div>
        <div className={`milestone ${progress >= 50 ? 'completed' : ''}`}>
          <span className="milestone-icon">🚀</span>
          <span className="milestone-label">50%</span>
        </div>
        <div className={`milestone ${progress >= 75 ? 'completed' : ''}`}>
          <span className="milestone-icon">⭐</span>
          <span className="milestone-label">75%</span>
        </div>
        <div className={`milestone ${progress >= 100 ? 'completed' : ''}`}>
          <span className="milestone-icon">🏆</span>
          <span className="milestone-label">100%</span>
        </div>
      </div>
    </div>
  );
}
