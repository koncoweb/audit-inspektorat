import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiCalendar, FiUser, FiFileText } from 'react-icons/fi';
import { 
  COLLECTIONS, 
  FOLLOW_UP_STATUS, 
  FOLLOW_UP_PRIORITY 
} from '../constants/collections';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import './FollowUpModal.css';

const FollowUpModal = ({ isOpen, onClose, followUp = null, onSuccess }) => {
  console.log('FollowUpModal props:', { isOpen, followUp });
  const [formData, setFormData] = useState({
    title: '',
    auditTitle: '',
    findingId: '',
    findingTitle: '',
    recommendation: '',
    assignedTo: '',
    deadline: '',
    priority: FOLLOW_UP_PRIORITY.MEDIUM,
    status: FOLLOW_UP_STATUS.NOT_STARTED,
    progress: 0,
    notes: '',
    actions: '',
    completionProof: ''
  });
  
  const [audits, setAudits] = useState([]);
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Debug audits state
  useEffect(() => {
    console.log('Audits state changed:', audits);
  }, [audits]);

  const isEdit = !!followUp;

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened, loading audits...');
      loadAudits();
      if (isEdit && followUp) {
        setFormData({
          title: followUp.title || '',
          auditTitle: followUp.auditTitle || '',
          recommendation: followUp.recommendation || '',
          assignedTo: followUp.assignedTo || '',
          deadline: followUp.deadline ? followUp.deadline.split('T')[0] : '',
          priority: followUp.priority || FOLLOW_UP_PRIORITY.MEDIUM,
          status: followUp.status || FOLLOW_UP_STATUS.NOT_STARTED,
          progress: followUp.progress || 0,
          notes: followUp.notes || '',
          actions: followUp.actions || '',
          completionProof: followUp.completionProof || ''
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, followUp, isEdit]);

  const loadAudits = async () => {
    try {
      console.log('Loading audits...');
      
      // Coba ambil semua audit terlebih dahulu
      const q = query(collection(db, COLLECTIONS.AUDITS));
      const querySnapshot = await getDocs(q);
      const auditsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('All audits loaded:', auditsData);
      
      // Filter audit yang sudah selesai atau yang memiliki status yang valid
      const completedAudits = auditsData.filter(audit => 
        audit.status === 'Selesai' || 
        audit.status === 'selesai' || 
        audit.status === 'COMPLETED' ||
        audit.status === 'completed'
      );
      
      console.log('Completed audits:', completedAudits);
      
      // Jika tidak ada audit selesai, gunakan semua audit
      const finalAudits = completedAudits.length > 0 ? completedAudits : auditsData;
      setAudits(finalAudits);
      
      console.log('Final audits for dropdown:', finalAudits);
    } catch (error) {
      console.error('Error loading audits:', error);
      // Fallback: set empty array jika ada error
      setAudits([]);
    }
  };

  const loadFindings = async (auditTitle) => {
    try {
      console.log('Loading findings for audit:', auditTitle);
      
      if (!auditTitle) {
        setFindings([]);
        return;
      }
      
      // Debug: Log the collection name and query
      console.log('Collection name:', COLLECTIONS.AUDIT_FINDINGS);
      console.log('Query auditTitle:', auditTitle);
      
      const q = query(
        collection(db, COLLECTIONS.AUDIT_FINDINGS),
        where('auditTitle', '==', auditTitle)
      );
      
      console.log('Executing query...');
      const querySnapshot = await getDocs(q);
      console.log('Query result count:', querySnapshot.docs.length);
      
      const findingsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Finding data:', data);
        return {
          id: doc.id,
          ...data
        };
      });
      
      console.log('Findings loaded:', findingsData);
      setFindings(findingsData);
      
      // If no findings found, try to load all findings to debug
      if (findingsData.length === 0) {
        console.log('No findings found, checking all findings in collection...');
        const allFindingsQuery = query(collection(db, COLLECTIONS.AUDIT_FINDINGS));
        const allFindingsSnapshot = await getDocs(allFindingsQuery);
        const allFindings = allFindingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('All findings in collection:', allFindings);
      }
    } catch (error) {
      console.error('Error loading findings:', error);
      setFindings([]);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      auditTitle: '',
      findingId: '',
      findingTitle: '',
      recommendation: '',
      assignedTo: '',
      deadline: '',
      priority: FOLLOW_UP_PRIORITY.MEDIUM,
      status: FOLLOW_UP_STATUS.NOT_STARTED,
      progress: 0,
      notes: '',
      actions: '',
      completionProof: ''
    });
    setErrors({});
    setFindings([]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul tindak lanjut harus diisi';
    }

    if (!formData.auditTitle.trim()) {
      newErrors.auditTitle = 'Audit harus dipilih';
    }

    if (!formData.findingId.trim()) {
      newErrors.findingId = 'Temuan audit harus dipilih';
    }

    if (!formData.recommendation.trim()) {
      newErrors.recommendation = 'Rekomendasi harus diisi';
    }

    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Penanggung jawab harus diisi';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline harus diisi';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      if (deadlineDate < today && !isEdit) {
        newErrors.deadline = 'Deadline tidak boleh di masa lalu';
      }
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress harus antara 0-100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const followUpData = {
        ...formData,
        deadline: new Date(formData.deadline).toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEdit) {
        await updateDoc(doc(db, COLLECTIONS.FOLLOW_UPS, followUp.id), followUpData);
      } else {
        followUpData.createdAt = new Date().toISOString();
        await addDoc(collection(db, COLLECTIONS.FOLLOW_UPS), followUpData);
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving follow-up:', error);
      setErrors({ submit: 'Terjadi kesalahan saat menyimpan data' });
    } finally {
      setLoading(false);
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

    // Load findings when audit is selected
    if (name === 'auditTitle') {
      loadFindings(value);
      // Reset finding selection when audit changes
      setFormData(prev => ({
        ...prev,
        findingId: '',
        findingTitle: '',
        recommendation: ''
      }));
    }

    // Auto-fill recommendation when finding is selected
    if (name === 'findingId') {
      const selectedFinding = findings.find(f => f.id === value);
      if (selectedFinding) {
        console.log('Selected finding:', selectedFinding);
        setFormData(prev => ({
          ...prev,
          findingTitle: selectedFinding.title,
          recommendation: selectedFinding.recommendation || '',
          assignedTo: selectedFinding.responsiblePerson || prev.assignedTo,
          title: `Tindak Lanjut - ${selectedFinding.title}` || prev.title
        }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? 'Edit Tindak Lanjut' : 'Tambah Tindak Lanjut'}
          </h2>
          <button
            onClick={onClose}
            className="modal-close-button"
          >
            <FiX className="btn-icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errors.submit && (
            <div className="error-alert">
              {errors.submit}
            </div>
          )}

          <div className="form-grid">
            {/* Title */}
            <div className="form-row full-width">
              <div className="form-group">
                <label className="form-label">
                  Judul Tindak Lanjut *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Masukkan judul tindak lanjut"
                />
                {errors.title && (
                  <p className="error-message">{errors.title}</p>
                )}
              </div>
            </div>

                         {/* Audit Selection */}
             <div className="form-row full-width">
               <div className="form-group">
                 <label className="form-label">
                   Audit *
                 </label>
                 <select
                   name="auditTitle"
                   value={formData.auditTitle}
                   onChange={handleInputChange}
                   className={`form-select ${errors.auditTitle ? 'error' : ''}`}
                 >
                   <option value="">
                     {audits.length === 0 ? 'Tidak ada audit tersedia' : 'Pilih Audit'}
                   </option>
                   {audits.map(audit => (
                     <option key={audit.id} value={audit.title}>
                       {audit.title} - {audit.status || 'Tidak ada status'}
                     </option>
                   ))}
                 </select>
                 {errors.auditTitle && (
                   <p className="error-message">{errors.auditTitle}</p>
                 )}
                 {audits.length === 0 && (
                   <div className="audit-help">
                     <p className="help-text">
                       Tidak ada data audit tersedia. 
                       <button 
                         type="button" 
                         onClick={() => {
                           console.log('Opening audit seed data...');
                           if (typeof window !== 'undefined' && window.runAuditSeedData) {
                             window.runAuditSeedData().then(() => {
                               console.log('Audit data added, reloading...');
                               loadAudits();
                             });
                           } else {
                             console.log('runAuditSeedData not available');
                           }
                         }}
                         className="help-link"
                       >
                         Klik di sini untuk menambahkan data audit contoh
                       </button>
                     </p>
                   </div>
                 )}
               </div>
             </div>

             {/* Finding Selection */}
             {formData.auditTitle && (
               <div className="form-row full-width">
                 <div className="form-group">
                   <label className="form-label">
                     Temuan Audit *
                   </label>
                   <select
                     name="findingId"
                     value={formData.findingId}
                     onChange={handleInputChange}
                     className={`form-select ${errors.findingId ? 'error' : ''}`}
                   >
                     <option value="">
                       {findings.length === 0 ? 'Tidak ada temuan tersedia' : 'Pilih Temuan'}
                     </option>
                     {findings.map(finding => (
                       <option key={finding.id} value={finding.id}>
                         {finding.findingNumber} - {finding.title} ({finding.severity})
                       </option>
                     ))}
                   </select>
                   {errors.findingId && (
                     <p className="error-message">{errors.findingId}</p>
                   )}
                   {findings.length === 0 && formData.auditTitle && (
                     <div className="audit-help">
                       <p className="help-text">
                         Tidak ada data temuan tersedia untuk audit ini. 
                         <button 
                           type="button" 
                           onClick={() => {
                             console.log('Opening findings seed data...');
                             if (typeof window !== 'undefined' && window.runFindingsSeedData) {
                               window.runFindingsSeedData().then(() => {
                                 console.log('Findings data added, reloading...');
                                 loadFindings(formData.auditTitle);
                               });
                             } else {
                               console.log('runFindingsSeedData not available');
                             }
                           }}
                           className="help-link"
                         >
                           Klik di sini untuk menambahkan data temuan contoh
                         </button>
                       </p>
                     </div>
                   )}
                 </div>
               </div>
             )}

            {/* Recommendation */}
            <div className="form-row full-width">
              <div className="form-group">
                <label className="form-label">
                  Rekomendasi *
                </label>
                <textarea
                  name="recommendation"
                  value={formData.recommendation}
                  onChange={handleInputChange}
                  rows={3}
                  className={`form-textarea ${errors.recommendation ? 'error' : ''}`}
                  placeholder="Masukkan rekomendasi dari temuan audit"
                />
                {errors.recommendation && (
                  <p className="error-message">{errors.recommendation}</p>
                )}
              </div>
            </div>

            {/* Assigned To */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Penanggung Jawab *
                </label>
                <div className="input-with-icon">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className={`form-input ${errors.assignedTo ? 'error' : ''}`}
                    placeholder="Masukkan nama penanggung jawab"
                  />
                </div>
                {errors.assignedTo && (
                  <p className="error-message">{errors.assignedTo}</p>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Deadline *
                </label>
                <div className="input-with-icon">
                  <FiCalendar className="input-icon" />
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className={`form-input ${errors.deadline ? 'error' : ''}`}
                  />
                </div>
                {errors.deadline && (
                  <p className="error-message">{errors.deadline}</p>
                )}
              </div>
            </div>

            {/* Priority and Status */}
            <div className="form-row two-columns">
              <div className="form-group">
                <label className="form-label">
                  Prioritas
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {Object.values(FOLLOW_UP_PRIORITY).map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {Object.values(FOLLOW_UP_STATUS).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Progress */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Progress (%)
                </label>
                <input
                  type="number"
                  name="progress"
                  value={formData.progress}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className={`form-input ${errors.progress ? 'error' : ''}`}
                />
                {errors.progress && (
                  <p className="error-message">{errors.progress}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="form-row full-width">
              <div className="form-group">
                <label className="form-label">
                  Tindakan yang Dilakukan
                </label>
                <textarea
                  name="actions"
                  value={formData.actions}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-textarea"
                  placeholder="Jelaskan tindakan yang akan atau sedang dilakukan"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="form-row full-width">
              <div className="form-group">
                <label className="form-label">
                  Catatan
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-textarea"
                  placeholder="Tambahkan catatan atau keterangan tambahan"
                />
              </div>
            </div>

            {/* Completion Proof */}
            {formData.status === FOLLOW_UP_STATUS.COMPLETED && (
              <div className="form-row full-width">
                <div className="form-group">
                  <label className="form-label">
                    Bukti Penyelesaian
                  </label>
                  <textarea
                    name="completionProof"
                    value={formData.completionProof}
                    onChange={handleInputChange}
                    rows={3}
                    className="form-textarea"
                    placeholder="Jelaskan bukti penyelesaian tindak lanjut"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              <FiSave className="btn-icon" />
              {loading ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowUpModal;
