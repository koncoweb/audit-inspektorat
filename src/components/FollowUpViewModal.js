import React from 'react';
import { FiX, FiEdit, FiTrash2, FiUser, FiCalendar, FiFileText, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';
import { FOLLOW_UP_STATUS, FOLLOW_UP_PRIORITY } from '../constants/collections';

const FollowUpViewModal = ({ isOpen, onClose, followUp, onEdit, onDelete }) => {
  if (!isOpen || !followUp) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case FOLLOW_UP_STATUS.NOT_STARTED:
        return 'status-not-started';
      case FOLLOW_UP_STATUS.IN_PROGRESS:
        return 'status-in-progress';
      case FOLLOW_UP_STATUS.COMPLETED:
        return 'status-completed';
      case FOLLOW_UP_STATUS.OVERDUE:
        return 'status-overdue';
      default:
        return 'status-not-started';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case FOLLOW_UP_PRIORITY.LOW:
        return 'priority-low';
      case FOLLOW_UP_PRIORITY.MEDIUM:
        return 'priority-medium';
      case FOLLOW_UP_PRIORITY.HIGH:
        return 'priority-high';
      default:
        return 'priority-medium';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case FOLLOW_UP_STATUS.NOT_STARTED:
        return <FiClock className="status-icon" />;
      case FOLLOW_UP_STATUS.IN_PROGRESS:
        return <FiClock className="status-icon" />;
      case FOLLOW_UP_STATUS.COMPLETED:
        return <FiCheckCircle className="status-icon" />;
      case FOLLOW_UP_STATUS.OVERDUE:
        return <FiAlertTriangle className="status-icon" />;
      default:
        return <FiClock className="status-icon" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date() && followUp.status !== FOLLOW_UP_STATUS.COMPLETED;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container view-modal">
        <div className="modal-header">
          <h2 className="modal-title">Detail Tindak Lanjut</h2>
          <div className="modal-actions">
            <button
              onClick={() => onEdit(followUp)}
              className="action-button edit"
              title="Edit"
            >
              <FiEdit className="action-icon" />
            </button>
            <button
              onClick={() => onDelete(followUp)}
              className="action-button delete"
              title="Hapus"
            >
              <FiTrash2 className="action-icon" />
            </button>
            <button onClick={onClose} className="close-button">
              <FiX />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* Header Info */}
          <div className="detail-header">
            <div className="detail-title-section">
              <h3 className="detail-title">{followUp.title}</h3>
              <div className="detail-badges">
                <span className={`priority-badge ${getPriorityColor(followUp.priority)}`}>
                  {followUp.priority}
                </span>
                <span className={`status-badge ${getStatusColor(followUp.status)}`}>
                  {getStatusIcon(followUp.status)}
                  {followUp.status}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="detail-section">
            <h4 className="section-title">Progress</h4>
            <div className="progress-container">
              <div className="progress-header">
                <span className="progress-label">Progress</span>
                <span className="progress-value">{followUp.progress || 0}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${
                    followUp.status === FOLLOW_UP_STATUS.COMPLETED 
                      ? 'completed' 
                      : followUp.status === FOLLOW_UP_STATUS.OVERDUE 
                      ? 'overdue' 
                      : 'in-progress'
                  }`}
                  style={{ width: `${followUp.progress || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Audit Information */}
          <div className="detail-section">
            <h4 className="section-title">Informasi Audit</h4>
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Audit</label>
                <p className="info-value">{followUp.auditTitle}</p>
              </div>
              {followUp.findingTitle && (
                <div className="info-item">
                  <label className="info-label">Temuan</label>
                  <p className="info-value">{followUp.findingTitle}</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendation */}
          <div className="detail-section">
            <h4 className="section-title">Rekomendasi</h4>
            <p className="detail-text">{followUp.recommendation}</p>
          </div>

          {/* Assignment & Timeline */}
          <div className="detail-section">
            <h4 className="section-title">Penugasan & Timeline</h4>
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">
                  <FiUser className="info-icon" />
                  Penanggung Jawab
                </label>
                <p className="info-value">{followUp.assignedTo}</p>
              </div>
              <div className="info-item">
                <label className="info-label">
                  <FiCalendar className="info-icon" />
                  Deadline
                </label>
                <p className="info-value">
                  {formatDate(followUp.deadline)}
                  {isOverdue(followUp.deadline) && (
                    <span className="overdue-indicator">(Terlambat)</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Actions & Notes */}
          {followUp.actions && (
            <div className="detail-section">
              <h4 className="section-title">Tindakan yang Dilakukan</h4>
              <p className="detail-text">{followUp.actions}</p>
            </div>
          )}

          {followUp.notes && (
            <div className="detail-section">
              <h4 className="section-title">Catatan</h4>
              <p className="detail-text">{followUp.notes}</p>
            </div>
          )}

          {/* Completion Info */}
          {followUp.status === FOLLOW_UP_STATUS.COMPLETED && (
            <div className="detail-section">
              <h4 className="section-title">Informasi Penyelesaian</h4>
              <div className="info-grid">
                {followUp.completedAt && (
                  <div className="info-item">
                    <label className="info-label">
                      <FiCheckCircle className="info-icon" />
                      Tanggal Selesai
                    </label>
                    <p className="info-value">{formatDate(followUp.completedAt)}</p>
                  </div>
                )}
                {followUp.completionProof && (
                  <div className="info-item">
                    <label className="info-label">
                      <FiFileText className="info-icon" />
                      Bukti Penyelesaian
                    </label>
                    <p className="info-value">{followUp.completionProof}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="detail-section">
            <h4 className="section-title">Timestamps</h4>
            <div className="info-grid">
              {followUp.createdAt && (
                <div className="info-item">
                  <label className="info-label">Dibuat</label>
                  <p className="info-value">{formatDate(followUp.createdAt)}</p>
                </div>
              )}
              {followUp.updatedAt && (
                <div className="info-item">
                  <label className="info-label">Terakhir Diupdate</label>
                  <p className="info-value">{formatDate(followUp.updatedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpViewModal;
