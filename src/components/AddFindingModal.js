import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiCalendar, FiUser, FiAlertTriangle } from 'react-icons/fi';
import { 
  FINDING_SEVERITY, 
  FINDING_CATEGORY, 
  FINDING_STATUS 
} from '../constants/collections';
import { auditService } from '../services/firebaseService';
import './AddFindingModal.css';

const AddFindingModal = ({ isOpen, onClose, onSave, audits = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recommendation: '',
    severity: FINDING_SEVERITY.MEDIUM,
    category: FINDING_CATEGORY.COMPLIANCE,
    status: FINDING_STATUS.OPEN,
    auditContext: '',
    responsibleParty: '',
    findingDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});
  const [availableAudits, setAvailableAudits] = useState([]);
  const [loadingAudits, setLoadingAudits] = useState(false);

  // Load available audits when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAvailableAudits();
    }
  }, [isOpen]);

  const loadAvailableAudits = async () => {
    try {
      setLoadingAudits(true);
      // Get all audits that are not completed
      const allAudits = await auditService.getAllAudits();
      const nonCompletedAudits = allAudits.filter(audit => 
        audit.status !== 'Selesai' && audit.status !== 'Completed'
      );
      setAvailableAudits(nonCompletedAudits);
    } catch (error) {
      console.error('Error loading audits:', error);
      // Fallback to empty array
      setAvailableAudits([]);
    } finally {
      setLoadingAudits(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Judul temuan harus diisi';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi temuan harus diisi';
    }
    
    if (!formData.recommendation.trim()) {
      newErrors.recommendation = 'Rekomendasi harus diisi';
    }
    
    if (!formData.auditContext.trim()) {
      newErrors.auditContext = 'Audit harus dipilih';
    }
    
    if (!formData.responsibleParty.trim()) {
      newErrors.responsibleParty = 'Penanggung jawab harus diisi';
    }
    
    if (!formData.findingDate) {
      newErrors.findingDate = 'Tanggal temuan harus diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      recommendation: '',
      severity: FINDING_SEVERITY.MEDIUM,
      category: FINDING_CATEGORY.COMPLIANCE,
      status: FINDING_STATUS.OPEN,
      auditContext: '',
      responsibleParty: '',
      findingDate: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal add-finding-modal">
        <div className="modal-header">
          <h2>
            <FiAlertTriangle className="modal-icon" />
            Tambah Temuan Baru
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="title">Judul Temuan *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Masukkan judul temuan audit"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="severity">Tingkat Keparahan *</label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
              >
                <option value={FINDING_SEVERITY.HIGH}>Tinggi</option>
                <option value={FINDING_SEVERITY.MEDIUM}>Sedang</option>
                <option value={FINDING_SEVERITY.LOW}>Rendah</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Kategori *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value={FINDING_CATEGORY.FINANCIAL}>Keuangan</option>
                <option value={FINDING_CATEGORY.COMPLIANCE}>Kepatuhan</option>
                <option value={FINDING_CATEGORY.PERFORMANCE}>Kinerja</option>
                <option value={FINDING_CATEGORY.OPERATIONAL}>Operasional</option>
                <option value={FINDING_CATEGORY.SYSTEM}>Sistem</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value={FINDING_STATUS.OPEN}>Terbuka</option>
                <option value={FINDING_STATUS.IN_PROGRESS}>Dalam Proses</option>
                <option value={FINDING_STATUS.IN_FOLLOW_UP}>Dalam Tindak Lanjut</option>
                <option value={FINDING_STATUS.COMPLETED}>Selesai</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="auditContext">Audit *</label>
              <select
                id="auditContext"
                name="auditContext"
                value={formData.auditContext}
                onChange={handleInputChange}
                className={errors.auditContext ? 'error' : ''}
                disabled={loadingAudits}
              >
                <option value="">Pilih audit...</option>
                {availableAudits.map(audit => (
                  <option key={audit.id} value={audit.title || audit.name}>
                    {audit.title || audit.name} - {audit.status}
                  </option>
                ))}
              </select>
              {loadingAudits && <span className="loading-text">Memuat data audit...</span>}
              {errors.auditContext && <span className="error-message">{errors.auditContext}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="description">Deskripsi Temuan *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Jelaskan detail temuan audit yang ditemukan"
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="recommendation">Rekomendasi *</label>
              <textarea
                id="recommendation"
                name="recommendation"
                value={formData.recommendation}
                onChange={handleInputChange}
                placeholder="Berikan rekomendasi untuk mengatasi temuan"
                rows="4"
                className={errors.recommendation ? 'error' : ''}
              />
              {errors.recommendation && <span className="error-message">{errors.recommendation}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="responsibleParty">Penanggung Jawab *</label>
              <div className="input-with-icon">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  id="responsibleParty"
                  name="responsibleParty"
                  value={formData.responsibleParty}
                  onChange={handleInputChange}
                  placeholder="Contoh: Kepala Bagian Keuangan"
                  className={errors.responsibleParty ? 'error' : ''}
                />
              </div>
              {errors.responsibleParty && <span className="error-message">{errors.responsibleParty}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="findingDate">Tanggal Temuan *</label>
              <div className="input-with-icon">
                <FiCalendar className="input-icon" />
                <input
                  type="date"
                  id="findingDate"
                  name="findingDate"
                  value={formData.findingDate}
                  onChange={handleInputChange}
                  className={errors.findingDate ? 'error' : ''}
                />
              </div>
              {errors.findingDate && <span className="error-message">{errors.findingDate}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              <FiSave />
              Simpan Temuan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFindingModal;
