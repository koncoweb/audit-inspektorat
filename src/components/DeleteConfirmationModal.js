import React from 'react';
import { FiX, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, itemType = 'item' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container delete-confirmation-modal">
        <div className="modal-header">
          <div className="delete-header">
            <FiAlertTriangle className="delete-icon" />
            <h2 className="modal-title">Konfirmasi Hapus</h2>
          </div>
          <button onClick={onClose} className="close-button">
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <div className="delete-content">
            <p className="delete-message">
              Apakah Anda yakin ingin menghapus <strong>{itemType}</strong> ini?
            </p>
            {itemName && (
              <div className="item-to-delete">
                <span className="item-label">Item yang akan dihapus:</span>
                <span className="item-name">{itemName}</span>
              </div>
            )}
            <p className="delete-warning">
              <FiAlertTriangle className="warning-icon" />
              Tindakan ini tidak dapat dibatalkan. Data yang dihapus tidak dapat dipulihkan.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Batal
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            <FiTrash2 className="btn-icon" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
