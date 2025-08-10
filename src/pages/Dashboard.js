import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFileText, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiClock,
  FiUsers,
  FiFile,
  FiCalendar
} from 'react-icons/fi';
import SummaryCard from '../components/SummaryCard';
import AuditItem from '../components/AuditItem';
import { dashboardService, auditService } from '../services/firebaseService';

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState({
    totalAudit: 0,
    temuanAudit: 0,
    selesai: 0,
    dalamProses: 0
  });

  const [recentAudits, setRecentAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard statistics
        const stats = await dashboardService.getDashboardStats();
        setSummaryData({
          totalAudit: stats.totalAudits || 0,
          temuanAudit: stats.totalFindings || 0,
          selesai: stats.completedAudits || 0,
          dalamProses: stats.inProgressAudits || 0
        });

        // Fetch recent audits
        const audits = await auditService.getRecentAudits(5);
        setRecentAudits(audits || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to dummy data if Firebase is not available
        setSummaryData({
          totalAudit: 24,
          temuanAudit: 156,
          selesai: 18,
          dalamProses: 6
        });
        setRecentAudits([
          {
            id: 1,
            title: 'Audit Keuangan Dinas Pendidikan',
            auditor: 'Sri Wahyuni',
            progress: 75,
            status: 'Dalam Proses',
            deadline: '2024-01-15'
          },
          {
            id: 2,
            title: 'Audit Kinerja Dinas Kesehatan',
            auditor: 'Ahmad Rahman',
            progress: 90,
            status: 'Review',
            deadline: '2024-01-20'
          },
          {
            id: 3,
            title: 'Audit Kepatuhan Dinas Lingkungan',
            auditor: 'Siti Nurhaliza',
            progress: 100,
            status: 'Selesai',
            deadline: '2024-01-10'
          },
          {
            id: 4,
            title: 'Audit Keuangan Dinas Perhubungan',
            auditor: 'Budi Santoso',
            progress: 45,
            status: 'Dalam Proses',
            deadline: '2024-01-25'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Buat Laporan',
      icon: FiFile,
      color: 'green',
      path: '/laporan/buat'
    },
    {
      title: 'Kelola Tim',
      icon: FiUsers,
      color: 'orange',
      path: '/manajemen-user'
    },
    {
      title: 'Jadwal Audit',
      icon: FiCalendar,
      color: 'blue',
      path: '/perencanaan'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-content">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Memuat data dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Summary Cards */}
      <div className="summary-cards">
        <SummaryCard
          title="Total Audit"
          value={summaryData.totalAudit}
          change="+12%"
          icon={FiFileText}
          color="blue"
        />
        <SummaryCard
          title="Temuan Audit"
          value={summaryData.temuanAudit}
          change="+8%"
          icon={FiAlertTriangle}
          color="red"
        />
        <SummaryCard
          title="Selesai"
          value={summaryData.selesai}
          change="+15%"
          icon={FiCheckCircle}
          color="green"
        />
        <SummaryCard
          title="Dalam Proses"
          value={summaryData.dalamProses}
          change="-2%"
          icon={FiClock}
          color="orange"
        />
      </div>

      {/* Content Sections */}
      <div className="content-sections">
        {/* Recent Audits */}
        <div className="audit-section">
          <div className="section-header">
            <h2 className="section-title">Audit Terbaru</h2>
          </div>
          <div className="audit-list">
            {recentAudits.length > 0 ? (
              recentAudits.map((audit) => (
                <AuditItem key={audit.id} audit={audit} />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Tidak ada audit terbaru
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <div className="section-header">
            <h2 className="section-title">Aksi Cepat</h2>
          </div>
          <div className="actions-list">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className={`action-button ${action.color}`}
              >
                <action.icon className="action-icon" />
                {action.title}
              </Link>
            ))}
          </div>

          {/* Today's Schedule */}
          <div className="schedule-section">
            <div className="section-header">
              <h2 className="section-title">Jadwal Hari Ini</h2>
            </div>
            <div className="schedule-content">
              <p>Tidak ada jadwal audit hari ini</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
