import React, { useState, useEffect } from 'react';
import ProjectCard, { ProjectStatus } from '../../components/ProjectsComponents/ProjectCard/ProjectCard';
import ProjectFilters from '../../components/ProjectsComponents/ProjectFilters/ProjectFilters';
import './Projects.css';

interface Project {
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

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Last Updated');


  return (
    <div className="projects-page">

     
    </div>
  );
};

export default Projects;