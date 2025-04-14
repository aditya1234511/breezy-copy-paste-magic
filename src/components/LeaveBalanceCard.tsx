
import React from 'react';

interface LeaveBalanceCardProps {
  id: string;
  name: string;
  color: string;
  stats: {
    allowed: string;
    available: string;
    taken: string;
  };
}

const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ 
  id, 
  name, 
  color, 
  stats 
}) => {
  // Create dynamic classes based on the color prop
  const cardBgClass = `bg-${color}-light`;
  const tagBgClass = `bg-${color}-dark`;
  
  return (
    <div className={`leave-card ${cardBgClass}`}>
      <div className={`leave-tag ${tagBgClass}`}></div>
      
      <div className="text-center mb-3">
        <h3 className="text-gray-700 font-medium text-sm">{name}</h3>
      </div>
      
      <div className="text-center">
        <p className="leave-initials text-gray-800">{id}</p>
      </div>
      
      <div className="space-y-1 mt-2">
        <div className="leave-stats">
          <span className="text-gray-600">Allowed</span>
          <span className="leave-stat-value">{stats.allowed}</span>
        </div>
        <div className="leave-stats">
          <span className="text-gray-600">Available</span>
          <span className="leave-stat-value">{stats.available}</span>
        </div>
        <div className="leave-stats">
          <span className="text-gray-600">Taken</span>
          <span className="leave-stat-value">{stats.taken}</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalanceCard;
