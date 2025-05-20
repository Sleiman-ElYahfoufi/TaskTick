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

      <div className="project-filters-actions">
        <div className="filter-tabs">
          {(['All', 'Active', 'Completed', 'Planning'] as FilterOption[]).map(filter => (
            <button
              key={filter}
              className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="project-controls">
          <div className="sort-dropdown">
            <span className="sort-label">Sort by</span>
            <div className="dropdown-container">
              <button
                className="dropdown-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {sortBy} <span className="dropdown-arrow">▼</span>
              </button>
              
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {sortOptions.map(option => (
                    <button
                      key={option}
                      className={`dropdown-item ${sortBy === option ? 'active' : ''}`}
                      onClick={() => handleSortSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button className="new-project-button" onClick={onNewProject}>
            + New Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;