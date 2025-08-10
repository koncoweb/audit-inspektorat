import React from 'react';

const SummaryCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
  const isPositive = change && change.startsWith('+');
  
  return (
    <div className="summary-card">
      <div className="card-header">
        <div className="card-title">{title}</div>
        <div className={`card-icon ${color}`}>
          <Icon />
        </div>
      </div>
      
      <div className="card-value">{value}</div>
      
      {change && (
        <div className={`card-change ${isPositive ? 'positive' : 'negative'}`}>
          {change}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
