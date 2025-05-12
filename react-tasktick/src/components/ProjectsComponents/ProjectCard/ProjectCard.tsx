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

  return (
   <></>
  );
};

export default ProjectCard;