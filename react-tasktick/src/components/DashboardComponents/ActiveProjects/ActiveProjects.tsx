import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActiveProjects.css';

interface Project {
  id: string;
  name: string;
  hours: string;
  status: string;
  progress: number;
}

interface ActiveProjectsProps {
  projects: Project[];
  onAddProject: () => void;
}

const ActiveProjects: React.FC<ActiveProjectsProps> = ({ projects, onAddProject }) => {
  const navigate = useNavigate();

  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/projects/${projectId}`);
  };

  return (
    <div className="active-projects-section">
      <div className="section-header">
        <h2>Active Projects</h2>
        <button className="add-project-btn" onClick={onAddProject}>Add Project</button>
      </div>
      
      
    </div>
  );
};

export default ActiveProjects;