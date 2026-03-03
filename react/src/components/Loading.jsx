import '../styles/loading.css';

export default function Loading({ fullScreen = false, message = 'Loading...' }) {
  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p className="loading-message">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}
