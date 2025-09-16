import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { db } from '../firebase/config.js';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';

// Constants inline to avoid import issues
const COLLECTIONS = {
  AUDITS: 'audits',
  AUDIT_FINDINGS: 'audit_findings',
  FOLLOW_UPS: 'follow_ups'
};

const FOLLOW_UP_STATUS = {
  NOT_STARTED: 'Belum Mulai',
  IN_PROGRESS: 'Dalam Proses',
  COMPLETED: 'Selesai',
  OVERDUE: 'Terlambat'
};

const FOLLOW_UP_PRIORITY = {
  LOW: 'Rendah',
  MEDIUM: 'Sedang',
  HIGH: 'Tinggi'
};

const FollowUpModalFixed = ({ isOpen, onClose, followUp = null, onSuccess }) => {
  console.log('FollowUpModalFixed props:', { isOpen, followUp });
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

  const isEdit = !!followUp;

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened, loading audits...');
      loadAudits();
      if (isEdit && followUp) {
        setFormData({
          title: followUp.title || '',
          auditTitle: followUp.auditTitle || '',
          findingId: followUp.findingId || '',
          findingTitle: followUp.findingTitle || '',
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
        
        // Load findings for the selected audit in edit mode
        if (followUp.auditTitle) {
          loadFindings(followUp.auditTitle);
        }
      } else {
        resetForm();
      }
    }
  }, [isOpen, followUp, isEdit]);

  const loadAudits = async () => {
    try {
      console.log('Loading audits...');
      
      const q = query(collection(db, COLLECTIONS.AUDITS));
      const querySnapshot = await getDocs(q);
      const auditsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('All audits loaded:', auditsData);
      
      const completedAudits = auditsData.filter(audit => 
        audit.status === 'Selesai' || 
        audit.status === 'selesai' || 
        audit.status === 'COMPLETED' ||
        audit.status === 'completed'
      );
      
      console.log('Completed audits:', completedAudits);
      
      const finalAudits = completedAudits.length > 0 ? completedAudits : auditsData;
      setAudits(finalAudits);
      
      console.log('Final audits for dropdown:', finalAudits);
    } catch (error) {
      console.error('Error loading audits:', error);
      setAudits([]);
    }
  };

  const loadFindings = async (auditTitle) => {
    try {
      console.log('=== LOAD FINDINGS DEBUG ===');
      console.log('Loading findings for audit:', auditTitle);
      
      if (!auditTitle) {
        console.log('No audit title provided, clearing findings');
        setFindings([]);
        return;
      }
      
      console.log('Collection name:', COLLECTIONS.AUDIT_FINDINGS);
      console.log('Query auditTitle:', auditTitle);
      
      // First, let's check all findings to see what we have
      console.log('Checking all findings in collection...');
      const allFindingsQuery = query(collection(db, COLLECTIONS.AUDIT_FINDINGS));
      const allFindingsSnapshot = await getDocs(allFindingsQuery);
      const allFindings = allFindingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('All findings in collection:', allFindings);
      console.log('Total findings count:', allFindings.length);
      
      // Check if we have any findings with the exact auditTitle
      const exactMatches = allFindings.filter(finding => finding.auditTitle === auditTitle);
      console.log('Exact matches for auditTitle:', exactMatches);
      console.log('Exact matches count:', exactMatches.length);
      
      // Also check for partial matches (case insensitive)
      const partialMatches = allFindings.filter(finding => 
        finding.auditTitle && 
        finding.auditTitle.toLowerCase().includes(auditTitle.toLowerCase())
      );
      console.log('Partial matches (case insensitive):', partialMatches);
      console.log('Partial matches count:', partialMatches.length);
      
      // Check for auditId matches (if available) - menggunakan document ID
      const selectedAudit = audits.find(audit => audit.title === auditTitle);
      let auditIdMatches = [];
      if (selectedAudit && selectedAudit.id) {
        console.log('Selected audit document ID:', selectedAudit.id);
        auditIdMatches = allFindings.filter(finding => finding.auditId === selectedAudit.id);
        console.log('AuditId matches (by document ID):', auditIdMatches);
        console.log('AuditId matches count:', auditIdMatches.length);
      }
      
      // Use exact matches if available, otherwise use partial matches or auditId matches
      let findingsToUse = exactMatches;
      if (findingsToUse.length === 0) {
        findingsToUse = auditIdMatches.length > 0 ? auditIdMatches : partialMatches;
      }
      
      console.log('Findings to use:', findingsToUse);
      console.log('Final findings count:', findingsToUse.length);
      
      setFindings(findingsToUse);
      
      // If still no findings, show all findings for debugging
      if (findingsToUse.length === 0) {
        console.log('No findings found for this audit. All available findings:');
        allFindings.forEach((finding, index) => {
          console.log(`${index + 1}. auditTitle: "${finding.auditTitle}" | auditId: "${finding.auditId}"`);
        });
        
        // Show help message
        console.log('=== TROUBLESHOOTING TIPS ===');
        console.log('1. Check if audit title matches exactly');
        console.log('2. Check if auditId matches');
        console.log('3. Check if findings data exists in Firestore');
        console.log('4. Run seed data if needed');
        console.log('5. Check Firestore rules');
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

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'auditTitle') {
      loadFindings(value);
      setFormData(prev => ({
        ...prev,
        findingId: '',
        findingTitle: '',
        recommendation: ''
      }));
    }

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
        minWidth: '600px',
        maxWidth: '900px',
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
          {errors.submit && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              {errors.submit}
            </div>
          )}

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
            {errors.title && <p style={{ color: 'red', fontSize: '12px' }}>{errors.title}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Audit *</label>
            <select
              name="auditTitle"
              value={formData.auditTitle}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
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
            {errors.auditTitle && <p style={{ color: 'red', fontSize: '12px' }}>{errors.auditTitle}</p>}
          </div>

                     {formData.auditTitle && (
             <div style={{ marginBottom: '15px' }}>
               <label>Temuan Audit *</label>
               <select
                 name="findingId"
                 value={formData.findingId}
                 onChange={handleInputChange}
                 style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                 required
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
               {errors.findingId && <p style={{ color: 'red', fontSize: '12px' }}>{errors.findingId}</p>}
               
                               {/* Help section if no findings */}
                {findings.length === 0 && formData.auditTitle && (
                  <div style={{ 
                    marginTop: '10px', 
                    padding: '10px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '4px',
                    border: '1px solid #dee2e6'
                  }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6c757d' }}>
                      Tidak ada data temuan tersedia untuk audit ini.
                    </p>
                    <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#6c757d' }}>
                      Pastikan data temuan sudah ada di collection 'audit_findings' dengan auditTitle yang sesuai.
                    </p>
                    <details style={{ marginBottom: '10px' }}>
                      <summary style={{ cursor: 'pointer', fontSize: '12px', color: '#007bff' }}>
                        Debug Info
                      </summary>
                      <div style={{ marginTop: '5px', fontSize: '11px', color: '#666' }}>
                        <p>Audit yang dipilih: <strong>{formData.auditTitle}</strong></p>
                        <p>Collection yang diquery: <strong>audit_findings</strong></p>
                        <p>Field yang dicari: <strong>auditTitle</strong></p>
                      </div>
                    </details>
                  </div>
                )}
             </div>
           )}

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
            {errors.recommendation && <p style={{ color: 'red', fontSize: '12px' }}>{errors.recommendation}</p>}
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
            {errors.assignedTo && <p style={{ color: 'red', fontSize: '12px' }}>{errors.assignedTo}</p>}
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
            {errors.deadline && <p style={{ color: 'red', fontSize: '12px' }}>{errors.deadline}</p>}
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
                {Object.values(FOLLOW_UP_PRIORITY).map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
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
                {Object.values(FOLLOW_UP_STATUS).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
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
            {errors.progress && <p style={{ color: 'red', fontSize: '12px' }}>{errors.progress}</p>}
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

          <div style={{ marginBottom: '15px' }}>
            <label>Catatan</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          {formData.status === FOLLOW_UP_STATUS.COMPLETED && (
            <div style={{ marginBottom: '15px' }}>
              <label>Bukti Penyelesaian</label>
              <textarea
                name="completionProof"
                value={formData.completionProof}
                onChange={handleInputChange}
                rows={3}
                placeholder="Masukkan bukti penyelesaian tindak lanjut..."
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          )}

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

export default FollowUpModalFixed;
