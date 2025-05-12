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
      <h2>Recent Activity</h2>
      
      <div className="activity-list">
        {activities.map(activity => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">
              <span className="activity-dot"></span>
            </div>
            <div className="activity-content">
              <div className="activity-description">
                {activity.project && (
                  <span className="activity-project">{activity.project} - </span>
                )}
                {activity.description}
              </div>
              <div className="activity-timestamp">{activity.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;