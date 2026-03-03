import '../styles/progress.css';

export default function ProgressBar({ 
  progress = 0, 
  label = null,
  showPercentage = true,
  size = 'medium',
  color = 'primary'
}) {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className={`progress-container progress-${size}`}>
      {label && (
        <div className="progress-header">
          <span className="progress-label">{label}</span>
          {showPercentage && (
            <span className="progress-percentage">{percentage}%</span>
          )}
        </div>
      )}
      <div className="progress-bar">
        <div 
          className={`progress-fill progress-${color}`}
          style={{ width: `${percentage}%` }}
        >
          {!label && showPercentage && percentage > 10 && (
            <span className="progress-text">{percentage}%</span>
          )}
        </div>
      </div>
    </div>
  );
}
