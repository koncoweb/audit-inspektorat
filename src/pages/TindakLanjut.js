import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEye, 
  FiEdit, 
  FiCheck, 
  FiClock, 
  FiFileText, 
  FiCheckCircle, 
  FiAlertTriangle,
  FiUser,
  FiCalendar,
  FiFilter,
  FiTrash2
} from 'react-icons/fi';
import { 
  COLLECTIONS, 
  FOLLOW_UP_STATUS, 
  FOLLOW_UP_PRIORITY 
} from '../constants/collections';
import { db } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import FollowUpModalFixed from '../components/FollowUpModalFixed';
import FollowUpViewModal from '../components/FollowUpViewModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import './TindakLanjut.css';
import '../components/FollowUpViewModal.css';
import '../components/DeleteConfirmationModal.css';

const TindakLanjut = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [priorityFilter, setPriorityFilter] = useState('Semua Prioritas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);

  // Summary statistics
  const [summary, setSummary] = useState({
    total: 0,
    notStarted: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });

  useEffect(() => {
    loadFollowUps();
  }, []);

  useEffect(() => {
    calculateSummary();
  }, [followUps]);

  const loadFollowUps = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, COLLECTIONS.FOLLOW_UPS),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const followUpsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFollowUps(followUpsData);
    } catch (error) {
      console.error('Error loading follow-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    const total = followUps.length;
    const notStarted = followUps.filter(f => f.status === FOLLOW_UP_STATUS.NOT_STARTED).length;
    const inProgress = followUps.filter(f => f.status === FOLLOW_UP_STATUS.IN_PROGRESS).length;
    const completed = followUps.filter(f => f.status === FOLLOW_UP_STATUS.COMPLETED).length;
    const overdue = followUps.filter(f => f.status === FOLLOW_UP_STATUS.OVERDUE).length;

    setSummary({
      total,
      notStarted,
      inProgress,
      completed,
      overdue
    });
  };

  const filteredFollowUps = followUps.filter(followUp => {
    const matchesSearch = followUp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         followUp.auditTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         followUp.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Semua Status' || followUp.status === statusFilter;
    const matchesPriority = priorityFilter === 'Semua Prioritas' || followUp.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const handleView = (followUp) => {
    setSelectedFollowUp(followUp);
    setShowViewModal(true);
  };

  const handleEdit = (followUp) => {
    console.log('Edit follow-up:', followUp);
    setSelectedFollowUp(followUp);
    setShowEditModal(true);
  };

  const handleDelete = (followUp) => {
    setSelectedFollowUp(followUp);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.FOLLOW_UPS, selectedFollowUp.id));
      setShowDeleteModal(false);
      setSelectedFollowUp(null);
      loadFollowUps();
    } catch (error) {
      console.error('Error deleting follow-up:', error);
    }
  };

  const handleComplete = async (followUp) => {
    try {
      await updateDoc(doc(db, COLLECTIONS.FOLLOW_UPS, followUp.id), {
        status: FOLLOW_UP_STATUS.COMPLETED,
        completedAt: new Date().toISOString(),
        progress: 100
      });
      loadFollowUps();
    } catch (error) {
      console.error('Error completing follow-up:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Memuat data tindak lanjut...</div>
      </div>
    );
  }

  return (
    <div className="tindak-lanjut-container">
      <div className="page-content">
        {/* Header Section */}
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">Tindak Lanjut</h1>
              <p className="page-subtitle">Monitoring dan tracking tindak lanjut temuan audit</p>
            </div>
            <button
              onClick={() => {
                console.log('Add button clicked');
                setShowAddModal(true);
              }}
              className="add-button"
            >
              <FiPlus className="button-icon" />
              Tambah Tindak Lanjut
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-card-header">
              <div>
                <p className="summary-card-title">Total Item</p>
                <p className="summary-card-value">{summary.total}</p>
              </div>
              <FiFileText className="summary-card-icon summary-icon-blue" />
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-card-header">
              <div>
                <p className="summary-card-title">Belum Mulai</p>
                <p className="summary-card-value">{summary.notStarted}</p>
              </div>
              <FiClock className="summary-card-icon summary-icon-gray" />
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-card-header">
              <div>
                <p className="summary-card-title">Dalam Proses</p>
                <p className="summary-card-value">{summary.inProgress}</p>
              </div>
              <FiClock className="summary-card-icon summary-icon-blue" />
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-card-header">
              <div>
                <p className="summary-card-title">Selesai</p>
                <p className="summary-card-value">{summary.completed}</p>
              </div>
              <FiCheckCircle className="summary-card-icon summary-icon-green" />
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-card-header">
              <div>
                <p className="summary-card-title">Terlambat</p>
                <p className="summary-card-value">{summary.overdue}</p>
              </div>
              <FiAlertTriangle className="summary-card-icon summary-icon-red" />
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="search-filter-container">
          <div className="search-filter-content">
            <div className="search-input">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Cari tindak lanjut..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <div className="filter-item">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option>Semua Status</option>
                  {Object.values(FOLLOW_UP_STATUS).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <FiFilter className="filter-icon" />
              </div>
              
              <div className="filter-item">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="filter-select"
                >
                  <option>Semua Prioritas</option>
                  {Object.values(FOLLOW_UP_PRIORITY).map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
                <FiFilter className="filter-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Items */}
      <div className="follow-up-list">
        {filteredFollowUps.length === 0 ? (
          <div className="empty-state">
            <FiFileText className="empty-state-icon" />
            <p className="empty-state-text">Tidak ada tindak lanjut yang ditemukan</p>
          </div>
        ) : (
          filteredFollowUps.map((followUp) => (
            <div key={followUp.id} className="follow-up-card">
              <div className="follow-up-header">
                <div className="follow-up-title-section">
                  <h3 className="follow-up-title">{followUp.title}</h3>
                  <span className={`priority-badge ${getPriorityColor(followUp.priority)}`}>
                    {followUp.priority}
                  </span>
                </div>
                
                <div className="follow-up-status-section">
                  <span className={`status-badge ${getStatusColor(followUp.status)}`}>
                    {getStatusIcon(followUp.status)}
                    {followUp.status}
                  </span>
                  
                  <div className="action-buttons">
                    <button
                      onClick={() => handleView(followUp)}
                      className="action-button view"
                      title="Lihat Detail"
                    >
                      <FiEye className="action-icon" />
                    </button>
                    <button
                      onClick={() => handleEdit(followUp)}
                      className="action-button edit"
                      title="Edit"
                    >
                      <FiEdit className="action-icon" />
                    </button>
                    {followUp.status !== FOLLOW_UP_STATUS.COMPLETED && (
                      <button
                        onClick={() => handleComplete(followUp)}
                        className="action-button complete"
                        title="Tandai Selesai"
                      >
                        <FiCheck className="action-icon" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(followUp)}
                      className="action-button delete"
                      title="Hapus"
                    >
                      <FiTrash2 className="action-icon" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="follow-up-content">
                <div className="follow-up-section">
                  <p className="section-label">Audit</p>
                  <p className="section-value">{followUp.auditTitle}</p>
                </div>
                
                <div className="follow-up-section">
                  <p className="section-label">Rekomendasi</p>
                  <p className="section-value">{followUp.recommendation}</p>
                </div>
              </div>

              <div className="follow-up-meta">
                <FiUser className="meta-icon" />
                <span className="section-value">{followUp.assignedTo}</span>
              </div>
              
              <div className="follow-up-meta">
                <FiCalendar className="meta-icon" />
                <span className="section-value">
                  Deadline: {formatDate(followUp.deadline)}
                  {isOverdue(followUp.deadline) && followUp.status !== FOLLOW_UP_STATUS.COMPLETED && (
                    <span className="overdue-indicator">(Terlambat)</span>
                  )}
                </span>
              </div>

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

              {followUp.notes && (
                <div className="follow-up-section">
                  <p className="section-label">Catatan</p>
                  <p className="section-value">{followUp.notes}</p>
                </div>
              )}

              {followUp.actions && (
                <div className="follow-up-section">
                  <p className="section-label">Tindakan</p>
                  <p className="section-value">{followUp.actions}</p>
                </div>
              )}

              {followUp.status === FOLLOW_UP_STATUS.COMPLETED && followUp.completionProof && (
                <div className="follow-up-section">
                  <p className="section-label">Bukti Penyelesaian</p>
                  <p className="section-value">{followUp.completionProof}</p>
                </div>
              )}

              {followUp.status === FOLLOW_UP_STATUS.COMPLETED && followUp.completedAt && (
                <div>
                  <p className="completion-date">
                    Diselesaikan pada: {formatDate(followUp.completedAt)}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <FollowUpModalFixed
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          console.log('Modal closing');
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedFollowUp(null);
        }}
        followUp={selectedFollowUp}
        onSuccess={loadFollowUps}
      />

      {/* View Modal */}
      <FollowUpViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedFollowUp(null);
        }}
        followUp={selectedFollowUp}
        onEdit={(followUp) => {
          setShowViewModal(false);
          setSelectedFollowUp(followUp);
          setShowEditModal(true);
        }}
        onDelete={(followUp) => {
          setShowViewModal(false);
          setSelectedFollowUp(followUp);
          setShowDeleteModal(true);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedFollowUp(null);
        }}
        onConfirm={confirmDelete}
        itemName={selectedFollowUp?.title}
        itemType="tindak lanjut"
      />
    </div>
  );
};

export default TindakLanjut;
