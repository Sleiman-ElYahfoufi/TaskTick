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

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  onSearch,
  onFilterChange,
  onSortChange,
  onNewProject
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Last Updated');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions: SortOption[] = [
    'Last Updated',
    'Name A-Z',
    'Name Z-A',
    'Oldest First',
    'Newest First'
  ];

  const handleFilterClick = (filter: FilterOption) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  const handleSortSelect = (sort: SortOption) => {
    setSortBy(sort);
    onSortChange(sort);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="project-filters-container">
      <div className="project-filters-header">
        <h1 className="projects-title">Projects</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Projects..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

     

       
         
       
      
    </div>
  );
};

export default ProjectFilters;