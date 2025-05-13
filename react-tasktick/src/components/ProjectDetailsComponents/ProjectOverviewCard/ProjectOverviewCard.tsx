import React from 'react';
import './ProjectOverviewCard.css';

interface ProjectOverviewCardProps {
  name: string;
  accuracy: number;
  completedTasks: number;
  totalTasks: number;
  timeSpent: number;
  totalEstimatedTime: number;
  compact?: boolean;
}

const ProjectOverviewCard: React.FC<ProjectOverviewCardProps> = ({
  name,
  accuracy,
  completedTasks,
  totalTasks,
  timeSpent,
  totalEstimatedTime,
  compact = false
}) => {
  return (
    <div className={`project-overview-card ${compact ? 'compact' : ''}`}>
      <div className="project-overview-content">
        <div className="project-overview-left">
          <h2 className="project-overview-project-name">{name}</h2>
          
          <div className="project-overview-stats">
            <div className="project-stat">
              <span className="project-overview-stat-label">Tasks</span>
              <span className="project-overview-stat-value">{completedTasks}/{totalTasks} tasks</span>
            </div>
            
           
          </div>
        </div>
        
      
      </div>
    </div>
  );
};

export default ProjectOverviewCard;