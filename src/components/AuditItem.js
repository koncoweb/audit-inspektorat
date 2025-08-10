import React from 'react';

const AuditItem = ({ audit }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'dalam proses':
        return 'process';
      case 'review':
        return 'review';
      case 'selesai':
        return 'completed';
      default:
        return 'process';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="audit-item">
      <div className="audit-header">
        <div>
          <div className="audit-title">{audit.title}</div>
          <div className="audit-auditor">Auditor: {audit.auditor}</div>
        </div>
        <div className={`audit-status ${getStatusClass(audit.status)}`}>
          {audit.status}
        </div>
      </div>
      
      <div className="audit-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${audit.progress}%` }}
          ></div>
        </div>
        <div className="progress-text">{audit.progress}% selesai</div>
      </div>
      
      <div className="audit-deadline">
        Deadline: {formatDate(audit.deadline)}
      </div>
    </div>
  );
};

export default AuditItem;
