import React from 'react';
import './ProjectCard.css';

export type ProjectStatus = 'in-progress' | 'planning' | 'delayed' | 'completed';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  estimatedHours: string;
  tasksCompleted: number;
  totalTasks: number;
  lastUpdatedDate: string;
  lastUpdatedTime: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  status,
  estimatedHours,
  tasksCompleted,
  totalTasks,
  lastUpdatedDate,
  lastUpdatedTime,
}) => {
  const statusConfig = {
    'in-progress': { text: 'In Progress', color: 'blue' },
    'planning': { text: 'Planning', color: 'yellow' },
    'delayed': { text: 'Delayed', color: 'red' },
    'completed': { text: 'Completed', color: 'green' }
  };

  const currentStatus = statusConfig[status];
  

  return (
    <div className={`project-card ${status}`}>
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        
        <div className="project-details">
          <div className="project-status-section">
            <span className={`status-badge ${status}`}>
              {currentStatus.text}
            </span>
            
            <div className="project-metrics">
              <div className="metric">
                <span className="metric-label">
                  {status === 'completed' ? 'Total Time' : 'Est. Time'}
                </span>
                <span className="metric-value">{estimatedHours} hours</span>
              </div>
              
              
        </div>
      </div>
    </div>
  ); 
};

export default ProjectCard;