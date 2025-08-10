import React from 'react';
import { FiBell, FiLogOut } from 'react-icons/fi';

const Header = ({ title, subtitle, user, onLogout }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      
      <div className="header-right">
        <FiBell className="notification-icon" />
        
        <div className="user-info">
          <div>
            <div style={{ fontWeight: '600', color: '#1e293b' }}>
              {user?.name || 'Dr. Ahmad Rahman'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {user?.role || 'Administrator'}
            </div>
          </div>
          
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          
          <FiLogOut 
            className="logout-icon" 
            onClick={handleLogout}
            title="Logout"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
