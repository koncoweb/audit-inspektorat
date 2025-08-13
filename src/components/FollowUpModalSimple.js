import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';

const FollowUpModalSimple = ({ isOpen, onClose, followUp = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    auditTitle: '',
    recommendation: '',
    assignedTo: '',
    deadline: '',
    priority: 'Sedang',
    status: 'Belum Mulai',
    progress: 0,
    notes: '',
    actions: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!followUp;

  useEffect(() => {
    if (isOpen) {
      if (isEdit && followUp) {
        setFormData({
          title: followUp.title || '',
          auditTitle: followUp.auditTitle || '',
          recommendation: followUp.recommendation || '',
          assignedTo: followUp.assignedTo || '',
          deadline: followUp.deadline ? followUp.deadline.split('T')[0] : '',
          priority: followUp.priority || 'Sedang',
          status: followUp.status || 'Belum Mulai',
          progress: followUp.progress || 0,
          notes: followUp.notes || '',
          actions: followUp.actions || ''
        });
      } else {
        setFormData({
          title: '',
          auditTitle: '',
          recommendation: '',
          assignedTo: '',
          deadline: '',
          priority: 'Sedang',
          status: 'Belum Mulai',
          progress: 0,
          notes: '',
          actions: ''
        });
      }
    }
  }, [isOpen, followUp, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate save
    setTimeout(() => {
      onSuccess();
      onClose();
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        minWidth: '500px',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2>{isEdit ? 'Edit Tindak Lanjut' : 'Tambah Tindak Lanjut'}</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Judul Tindak Lanjut *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Audit *</label>
            <input
              type="text"
              name="auditTitle"
              value={formData.auditTitle}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Rekomendasi *</label>
            <textarea
              name="recommendation"
              value={formData.recommendation}
              onChange={handleInputChange}
              rows={3}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Penanggung Jawab *</label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Deadline *</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>Prioritas</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="Belum Mulai">Belum Mulai</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Selesai">Selesai</option>
                <option value="Terlambat">Terlambat</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Progress (%)</label>
            <input
              type="number"
              name="progress"
              value={formData.progress}
              onChange={handleInputChange}
              min="0"
              max="100"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Tindakan yang Dilakukan</label>
            <textarea
              name="actions"
              value={formData.actions}
              onChange={handleInputChange}
              rows={3}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Catatan</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                background: '#007bff',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowUpModalSimple;
