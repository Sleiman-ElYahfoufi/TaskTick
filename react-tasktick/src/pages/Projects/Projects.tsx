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

  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'E-commerce Platform Redesign',
        description: 'Redesign the UI/UX of our e-commerce platform with focus on mobile experience',
        status: 'in-progress',
        estimatedHours: '230-245',
        tasksCompleted: 28,
        totalTasks: 45,
        lastUpdatedDate: 'Today',
        lastUpdatedTime: '9:15 AM'
      },
      {
        id: '2',
        title: 'Mobile App Development',
        description: 'Create a new mobile application with React Native for both iOS and Android platforms',
        status: 'planning',
        estimatedHours: '320-350',
        tasksCompleted: 5,
        totalTasks: 60,
        lastUpdatedDate: 'Yesterday',
        lastUpdatedTime: '2:30 PM'
      },
      {
        id: '3',
        title: 'Backend API Integration',
        description: 'Integrate payment gateways and shipping APIs into our existing backend infrastructure',
        status: 'delayed',
        estimatedHours: '150-180',
        tasksCompleted: 12,
        totalTasks: 35,
        lastUpdatedDate: 'Today',
        lastUpdatedTime: '11:20 AM'
      },
      {
        id: '4',
        title: 'Marketing Website Refresh',
        description: 'Update design and content of our marketing website to align with new brand guidelines',
        status: 'completed',
        estimatedHours: '180-200',
        tasksCompleted: 42,
        totalTasks: 42,
        lastUpdatedDate: 'May 8',
        lastUpdatedTime: '4:45 PM'
      }
    ];

    setProjects(mockProjects);
    setFilteredProjects(mockProjects);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, activeFilter, sortBy);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    applyFilters(searchTerm, filter, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    applyFilters(searchTerm, activeFilter, sort);
  };

  const applyFilters = (search: string, filter: string, sort: string) => {
    let result = [...projects];

    if (search) {
      result = result.filter(
        project => 
          project.title.toLowerCase().includes(search.toLowerCase()) ||
          project.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter !== 'All') {
      const statusMap: { [key: string]: ProjectStatus } = {
        'Active': 'in-progress',
        'Completed': 'completed',
        'Planning': 'planning'
      };
      
      if (statusMap[filter]) {
        result = result.filter(project => project.status === statusMap[filter]);
      }
    }

    // Apply sorting
    switch (sort) {
      case 'Name A-Z':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Name Z-A':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'Oldest First':
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case 'Newest First':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default: 
        result = [...result]; 
    }

    setFilteredProjects(result);
  };

  const handleNewProject = () => {
    console.log('Create new project clicked');
    alert('Create new project functionality would go here');
  };

  return (
    <div className="projects-page">

      <ProjectFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange} 
        onSortChange={handleSortChange}
        onNewProject={handleNewProject}
      />

      <div className="projects-list">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              {...project}
            />
          ))
        ) : (
          <div className="no-projects">
            <p>No projects match your filters.</p>
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('All');
                setSortBy('Last Updated');
                setFilteredProjects(projects);
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;