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
   <></>
  );
};

export default ProjectOverviewCard;