import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiFileText, 
  FiAlertTriangle, 
  FiFile, 
  FiFolder, 
  FiCheckSquare, 
  FiUsers, 
  FiHelpCircle, 
  FiSettings 
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/perencanaan', icon: FiCalendar, label: 'Perencanaan Audit' },
    { path: '/pelaksanaan', icon: FiFileText, label: 'Pelaksanaan Audit' },
    { path: '/temuan', icon: FiAlertTriangle, label: 'Temuan Audit' },
    { path: '/laporan', icon: FiFile, label: 'Laporan' },
    { path: '/dokumen', icon: FiFolder, label: 'Dokumen' },
    { path: '/tindak-lanjut', icon: FiCheckSquare, label: 'Tindak Lanjut' },
    { path: '/manajemen-user', icon: FiUsers, label: 'Manajemen User' },
    { path: '/panduan', icon: FiHelpCircle, label: 'Panduan' },
    { path: '/pengaturan', icon: FiSettings, label: 'Pengaturan' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <FiShield />
          </div>
          <div className="logo-text">
            Inspektorat<br />
            Kabupaten Morowali Utara
          </div>
        </div>
      </div>
      
      <nav>
        <ul className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

// Custom Shield icon component
const FiShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default Sidebar;
