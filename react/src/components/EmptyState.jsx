import '../styles/empty-state.css';

export default function EmptyState({ 
  icon = '📭', 
  title = 'No data found', 
  message = 'There is nothing to display here yet.',
  action = null,
  actionText = 'Get Started',
  onAction = null
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && onAction && (
        <button className="empty-state-action" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}
