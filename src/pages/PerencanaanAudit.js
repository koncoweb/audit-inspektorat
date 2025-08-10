import React, { useState } from 'react';
import { 
  FiCalendar, 
  FiList, 
  FiPlus, 
  FiChevronLeft, 
  FiChevronRight,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle
} from 'react-icons/fi';

const PerencanaanAudit = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

  // Sample audit plans data
  const auditPlans = [
    {
      id: 1,
      title: 'Audit Keuangan Dinas Pendidikan',
      status: 'draft',
      priority: 'high',
      startDate: new Date(2025, 7, 15),
      endDate: new Date(2025, 7, 30),
      auditor: 'Dr. Ahmad Rahman'
    },
    {
      id: 2,
      title: 'Audit Kinerja Dinas Kesehatan',
      status: 'approved',
      priority: 'high',
      startDate: new Date(2025, 7, 10),
      endDate: new Date(2025, 7, 25),
      auditor: 'Siti Nurhaliza'
    },
    {
      id: 3,
      title: 'Audit Kepatuhan Dinas Lingkungan',
      status: 'ongoing',
      priority: 'medium',
      startDate: new Date(2025, 7, 5),
      endDate: new Date(2025, 7, 20),
      auditor: 'Budi Santoso'
    }
  ];

  // Summary statistics
  const summaryStats = {
    total: auditPlans.length,
    draft: auditPlans.filter(plan => plan.status === 'draft').length,
    approved: auditPlans.filter(plan => plan.status === 'approved').length,
    ongoing: auditPlans.filter(plan => plan.status === 'ongoing').length,
    completed: auditPlans.filter(plan => plan.status === 'completed').length,
    highPriority: auditPlans.filter(plan => plan.priority === 'high').length
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const getPlansForDate = (day) => {
    return auditPlans.filter(plan => {
      const planStart = plan.startDate.getDate();
      const planEnd = plan.endDate.getDate();
      return day >= planStart && day <= planEnd;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return '#e2e8f0';
      case 'approved': return '#dbeafe';
      case 'ongoing': return '#fef3c7';
      case 'completed': return '#d1fae5';
      default: return '#e2e8f0';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'approved': return 'Disetujui';
      case 'ongoing': return 'Berlangsung';
      case 'completed': return 'Selesai';
      default: return 'Draft';
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="perencanaan-content">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>Perencanaan Audit</h1>
          <p>Kelola dan rencanakan kegiatan audit internal</p>
        </div>
        
        <div className="view-controls">
          <div className="view-toggles">
            <button 
              className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FiList />
              <span>List</span>
            </button>
            <button 
              className={`view-toggle ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              <FiCalendar />
              <span>Kalender</span>
            </button>
          </div>
          <button className="add-plan-btn">
            <FiPlus />
            <span>+ Tambah Rencana</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-header">
            <span className="card-title">Total Rencana</span>
            <div className="card-icon blue">
              <FiCalendar />
            </div>
          </div>
          <div className="card-value">{summaryStats.total}</div>
        </div>
        
        <div className="summary-card">
          <div className="card-header">
            <span className="card-title">Draft</span>
            <div className="card-icon gray">
              <FiFileText />
            </div>
          </div>
          <div className="card-value">{summaryStats.draft}</div>
        </div>
        
        <div className="summary-card">
          <div className="card-header">
            <span className="card-title">Disetujui</span>
            <div className="card-icon blue">
              <FiCheckCircle />
            </div>
          </div>
          <div className="card-value">{summaryStats.approved}</div>
        </div>
        
        <div className="summary-card">
          <div className="card-header">
            <span className="card-title">Berlangsung</span>
            <div className="card-icon orange">
              <FiClock />
            </div>
          </div>
          <div className="card-value orange">{summaryStats.ongoing}</div>
        </div>
        
        <div className="summary-card">
          <div className="card-header">
            <span className="card-title">Selesai</span>
            <div className="card-icon green">
              <FiCheckCircle />
            </div>
          </div>
          <div className="card-value green">{summaryStats.completed}</div>
        </div>
        
        <div className="summary-card">
          <div className="card-header">
            <span className="card-title">Prioritas Tinggi</span>
            <div className="card-icon red">
              <FiAlertTriangle />
            </div>
          </div>
          <div className="card-value red">{summaryStats.highPriority}</div>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="calendar-section">
          {/* Calendar Header */}
          <div className="calendar-header">
            <div className="month-navigation">
              <button className="nav-btn" onClick={() => navigateMonth('prev')}>
                <FiChevronLeft />
              </button>
              <h2 className="current-month">{formatDate(currentDate)}</h2>
              <button className="nav-btn" onClick={() => navigateMonth('next')}>
                <FiChevronRight />
              </button>
            </div>
            <button className="today-btn" onClick={goToToday}>
              Hari Ini
            </button>
          </div>

          {/* Calendar Legend */}
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#e2e8f0' }}></div>
              <span>Draft</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#dbeafe' }}></div>
              <span>Disetujui</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#fef3c7' }}></div>
              <span>Berlangsung</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#d1fae5' }}></div>
              <span>Selesai</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {/* Day Headers */}
            <div className="calendar-day-header">Min</div>
            <div className="calendar-day-header">Sen</div>
            <div className="calendar-day-header">Sel</div>
            <div className="calendar-day-header">Rab</div>
            <div className="calendar-day-header">Kam</div>
            <div className="calendar-day-header">Jum</div>
            <div className="calendar-day-header">Sab</div>

            {/* Calendar Days */}
            {days.map((day, index) => (
              <div 
                key={index} 
                className={`calendar-day ${day ? '' : 'empty'} ${day && isToday(day) ? 'today' : ''}`}
              >
                {day && (
                  <>
                    <div className="day-number">{day}</div>
                    <div className="day-events">
                      {getPlansForDate(day).map(plan => (
                        <div 
                          key={plan.id}
                          className="day-event"
                          style={{ backgroundColor: getStatusColor(plan.status) }}
                          title={`${plan.title} - ${getStatusText(plan.status)}`}
                        >
                          <div className="event-dot"></div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="list-section">
          <div className="list-header">
            <h3>Daftar Rencana Audit</h3>
          </div>
          <div className="audit-list">
            {auditPlans.map(plan => (
              <div key={plan.id} className="audit-item">
                <div className="audit-header">
                  <div>
                    <div className="audit-title">{plan.title}</div>
                    <div className="audit-auditor">{plan.auditor}</div>
                  </div>
                  <div className={`audit-status ${plan.status}`}>
                    {getStatusText(plan.status)}
                  </div>
                </div>
                <div className="audit-dates">
                  {plan.startDate.toLocaleDateString('id-ID')} - {plan.endDate.toLocaleDateString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerencanaanAudit;
