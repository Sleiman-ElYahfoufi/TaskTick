import React, { useState } from 'react';
import './ProjectFilters.css';

type SortOption = 'Last Updated' | 'Name A-Z' | 'Name Z-A' | 'Oldest First' | 'Newest First';
type FilterOption = 'All' | 'Active' | 'Completed' | 'Planning';

interface ProjectFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filter: FilterOption) => void;
  onSortChange: (sortBy: SortOption) => void;
  onNewProject: () => void;
}

const ProjectFilters: React.FC = () => {
 

  return (
    <div className="project-filters-container">
     
    </div>
  );
};

export default ProjectFilters;