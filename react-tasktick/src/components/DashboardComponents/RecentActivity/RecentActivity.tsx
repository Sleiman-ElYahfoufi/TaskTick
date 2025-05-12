import React from 'react';
import './RecentActivity.css';

interface ActivityItem {
  id: string;
  type: string;
  project?: string;
  description: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="recent-activity">
    
    </div>
  );
};

export default RecentActivity;