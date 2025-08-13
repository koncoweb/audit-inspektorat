import React from 'react';

const FollowUpModalTest = ({ isOpen, onClose, followUp = null, onSuccess }) => {
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '400px'
      }}>
        <h2>Test Modal</h2>
        <p>This is a test modal to check if import works</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FollowUpModalTest;
