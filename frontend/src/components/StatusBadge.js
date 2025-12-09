import './StatusBadge.css';

function StatusBadge({ status }) {
  const formatStatus = (status) => {
    switch (status) {
      case 'NOT_STARTED':
        return 'Not Started';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETE':
        return 'Complete';
      default:
        return status;
    }
  };

  return (
    <span className={`status-badge status-${status.toLowerCase().replace('_', '-')}`}>
      {formatStatus(status)}
    </span>
  );
}

export default StatusBadge;
