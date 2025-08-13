import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/firebaseService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import './Laporan.css';

const Laporan = () => {
  const [stats, setStats] = useState({
    totalAudit: 0,
    selesai: 0,
    totalTemuan: 0,
    ditindaklanjuti: 0,
    prioritasTinggi: 0,
    rataRataDurasi: 0
  });
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [filterType, setFilterType] = useState('Semua Jenis');
  const [filterYear, setFilterYear] = useState('2024');


  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics and trend data
      const [reportStats, trendData] = await Promise.all([
        dashboardService.getReportStats(),
        dashboardService.getTrendData()
      ]);

      // If no real data, use dummy data for demonstration
      const finalStats = reportStats.totalAudit > 0 ? reportStats : {
        totalAudit: 24,
        selesai: 18,
        totalTemuan: 156,
        ditindaklanjuti: 89,
        prioritasTinggi: 34,
        rataRataDurasi: 12
      };

      const finalTrendData = trendData.length > 0 ? trendData : [
        { month: 'Jan', audit: 3, temuan: 12 },
        { month: 'Feb', audit: 4, temuan: 18 },
        { month: 'Mar', audit: 6, temuan: 25 },
        { month: 'Apr', audit: 2, temuan: 8 },
        { month: 'May', audit: 5, temuan: 20 },
        { month: 'Jun', audit: 4, temuan: 15 }
      ];

      // Sample reports data
      const sampleReports = [
        {
          id: 1,
          title: 'Laporan Audit Semester I 2024',
          subtitle: '12 audit, 45 temuan',
          type: 'Laporan Audit',
          period: 'Januari - Juni 2024',
          status: 'Published',
          createdBy: 'Ahmad Rahman',
          date: '2024-07-15',
          auditCount: 12,
          findingCount: 45
        },
        {
          id: 2,
          title: 'Laporan Kinerja Inspektorat 2024',
          subtitle: '24 audit, 89 temuan',
          type: 'Laporan Kinerja',
          period: 'Januari - Desember 2024',
          status: 'Draft',
          createdBy: 'Sri Wahyuni',
          date: '2024-01-10',
          auditCount: 24,
          findingCount: 89
        },
        {
          id: 3,
          title: 'Laporan Temuan Prioritas Tinggi',
          subtitle: '8 audit, 23 temuan',
          type: 'Laporan Temuan',
          period: 'Q4 2023',
          status: 'Approved',
          createdBy: 'Budi Santoso',
          date: '2024-01-05',
          auditCount: 8,
          findingCount: 23
        }
      ];

      setStats(finalStats);
      setTrendData(finalTrendData);
      setReports(sampleReports);
    } catch (error) {
      console.error('Error fetching report data:', error);
      // Fallback to dummy data
      setStats({
        totalAudit: 24,
        selesai: 18,
        totalTemuan: 156,
        ditindaklanjuti: 89,
        prioritasTinggi: 34,
        rataRataDurasi: 12
      });
      setTrendData([
        { month: 'Jan', audit: 3, temuan: 12 },
        { month: 'Feb', audit: 4, temuan: 18 },
        { month: 'Mar', audit: 6, temuan: 25 },
        { month: 'Apr', audit: 2, temuan: 8 },
        { month: 'May', audit: 5, temuan: 20 },
        { month: 'Jun', audit: 4, temuan: 15 }
      ]);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };



  const reportTemplates = [
    {
      id: 1,
      title: 'Laporan Audit',
      subtitle: 'Template standar audit',
      icon: '📄',
      type: 'audit'
    },
    {
      id: 2,
      title: 'Laporan Kinerja',
      subtitle: 'Evaluasi kinerja',
      icon: '✅',
      type: 'performance'
    },
    {
      id: 3,
      title: 'Laporan Temuan',
      subtitle: 'Ringkasan temuan',
      icon: '⚠️',
      type: 'findings'
    },
    {
      id: 4,
      title: 'Laporan Tahunan',
      subtitle: 'Komprehensif tahunan',
      icon: '📅',
      type: 'annual'
    }
  ];

  const handleGenerateReport = (template) => {
    // Here you would implement the actual report generation logic
    console.log('Generating report:', template);
    
    // Show success message
    alert(`Laporan ${template.title} sedang dibuat...`);
  };

  // Calculate additional statistics
  const getStatusDistribution = () => {
    const total = stats.totalAudit;
    if (total === 0) return { draft: 0, ongoing: 0, completed: 0 };
    
    return {
      draft: Math.round((stats.totalAudit - stats.selesai) * 0.3),
      ongoing: Math.round((stats.totalAudit - stats.selesai) * 0.7),
      completed: stats.selesai
    };
  };

  const getCategoryStats = () => {
    const total = stats.totalTemuan;
    if (total === 0) return { kepatuhan: 0, operasional: 0, keuangan: 0 };
    
    return {
      kepatuhan: Math.round(total * 0.4),
      operasional: Math.round(total * 0.35),
      keuangan: Math.round(total * 0.25)
    };
  };

  const handleDownloadReport = (report) => {
    console.log('Downloading report:', report);
    alert(`Mengunduh laporan: ${report.title}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return <span className="status-badge published">{status}</span>;
      case 'Approved':
        return <span className="status-badge approved">{status}</span>;
      case 'Draft':
        return <span className="status-badge draft">{status}</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };



  if (loading) {
    return (
      <div className="laporan-loading">
        <div className="loading-spinner"></div>
        <p>Memuat data laporan...</p>
      </div>
    );
  }

  return (
    <div className="laporan-container">
      {/* Header Section */}
      <div className="laporan-header">
        <div className="laporan-title">
          <h1>Laporan</h1>
          <p>Statistik dan laporan audit internal</p>
        </div>
        <button 
          className="generate-report-btn"
          onClick={() => handleGenerateReport({ title: 'Laporan Umum' })}
        >
          <span>📄</span>
          Generate Laporan
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📊</div>
          <div className="stat-content">
            <h3>Total Audit</h3>
            <p className="stat-number">{stats.totalAudit}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-content">
            <h3>Selesai</h3>
            <p className="stat-number">{stats.selesai}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">⚠️</div>
          <div className="stat-content">
            <h3>Total Temuan</h3>
            <p className="stat-number">{stats.totalTemuan}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">📈</div>
          <div className="stat-content">
            <h3>Ditindaklanjuti</h3>
            <p className="stat-number">{stats.ditindaklanjuti}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">🚨</div>
          <div className="stat-content">
            <h3>Prioritas Tinggi</h3>
            <p className="stat-number">{stats.prioritasTinggi}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">⏰</div>
          <div className="stat-content">
            <h3>Rata-rata Durasi</h3>
            <p className="stat-number">{stats.rataRataDurasi} hari</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Tren Audit & Temuan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="audit" fill="#0088FE" name="Audit" />
              <Bar dataKey="temuan" fill="#FF8042" name="Temuan" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="report-templates">
          <h3>Template Laporan</h3>
          <div className="templates-grid">
            {reportTemplates.map((template) => (
              <div 
                key={template.id} 
                className="template-card"
                onClick={() => handleGenerateReport(template)}
              >
                <div className="template-icon">{template.icon}</div>
                <div className="template-content">
                  <h4>{template.title}</h4>
                  <p>{template.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="additional-stats">
        <div className="stat-section">
          <h3>Distribusi Status Audit</h3>
          <div className="status-distribution">
            {(() => {
              const statusDist = getStatusDistribution();
              return (
                <>
                  <div className="status-item">
                    <span className="status-dot draft"></span>
                    <span>Draft ({statusDist.draft})</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot ongoing"></span>
                    <span>Berlangsung ({statusDist.ongoing})</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot completed"></span>
                    <span>Selesai ({statusDist.completed})</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        <div className="stat-section">
          <h3>Kategori Temuan</h3>
          <div className="category-stats">
            {(() => {
              const categoryStats = getCategoryStats();
              const total = stats.totalTemuan;
              return (
                <>
                  <div className="category-item">
                    <span className="category-label">Kepatuhan</span>
                    <div className="category-bar">
                      <div 
                        className="category-fill" 
                        style={{ width: `${total > 0 ? (categoryStats.kepatuhan / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="category-value">{categoryStats.kepatuhan}</span>
                  </div>
                  <div className="category-item">
                    <span className="category-label">Operasional</span>
                    <div className="category-bar">
                      <div 
                        className="category-fill" 
                        style={{ width: `${total > 0 ? (categoryStats.operasional / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="category-value">{categoryStats.operasional}</span>
                  </div>
                  <div className="category-item">
                    <span className="category-label">Keuangan</span>
                    <div className="category-bar">
                      <div 
                        className="category-fill" 
                        style={{ width: `${total > 0 ? (categoryStats.keuangan / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="category-value">{categoryStats.keuangan}</span>
                  </div>
                </>
              );
            })()}
          </div>
                 </div>
       </div>

       {/* Report List Section */}
       <div className="report-list-section">
         <div className="report-list-header">
           <h3>Daftar Laporan</h3>
           <div className="report-filters">
             <select 
               value={filterType} 
               onChange={(e) => setFilterType(e.target.value)}
               className="filter-select"
             >
               <option value="Semua Jenis">Semua Jenis</option>
               <option value="Laporan Audit">Laporan Audit</option>
               <option value="Laporan Kinerja">Laporan Kinerja</option>
               <option value="Laporan Temuan">Laporan Temuan</option>
               <option value="Laporan Tahunan">Laporan Tahunan</option>
             </select>
             <select 
               value={filterYear} 
               onChange={(e) => setFilterYear(e.target.value)}
               className="filter-select"
             >
               <option value="2024">2024</option>
               <option value="2023">2023</option>
               <option value="2022">2022</option>
             </select>
           </div>
         </div>

         <div className="report-table-container">
           <table className="report-table">
             <thead>
               <tr>
                 <th>Judul Laporan</th>
                 <th>Jenis</th>
                 <th>Periode</th>
                 <th>Status</th>
                 <th>Dibuat Oleh</th>
                 <th>Tanggal</th>
                 <th>Aksi</th>
               </tr>
             </thead>
             <tbody>
               {reports.map((report) => (
                 <tr key={report.id}>
                   <td>
                     <div className="report-title-cell">
                       <div className="report-title">{report.title}</div>
                       <div className="report-subtitle">{report.subtitle}</div>
                     </div>
                   </td>
                   <td>{report.type}</td>
                   <td>{report.period}</td>
                   <td>{getStatusBadge(report.status)}</td>
                   <td>{report.createdBy}</td>
                   <td>{report.date}</td>
                   <td>
                     <button 
                       className="download-btn"
                       onClick={() => handleDownloadReport(report)}
                       title="Download Laporan"
                     >
                       📥
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
     </div>
   );
 };

export default Laporan;
