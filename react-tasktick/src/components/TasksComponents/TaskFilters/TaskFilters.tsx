import React from 'react';
import './TaskFilters.css';

interface TaskFiltersProps {
  searchTerm: string;
  projectFilter: string;
  statusFilter: string;
  dueDateFilter: string;
  onSearchChange: (value: string) => void;
  onProjectFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onDueDateFilterChange: (value: string) => void;
  projectOptions?: string[];
  statusOptions?: string[];
  dueDateOptions?: string[];
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchTerm,
  projectFilter,
  statusFilter,
  dueDateFilter,
  onSearchChange,
  onProjectFilterChange,
  onStatusFilterChange,
  onDueDateFilterChange,
  projectOptions = ['All Projects', 'E-commerce Site', 'Mobile App', 'Marketing Website'],
  statusOptions = ['All Statuses', 'In Progress', 'Completed', 'Not Started'],
  dueDateOptions = ['Due Date', 'Due Today', 'Due This Week', 'Due This Month']
}) => {
  return (
    <div className="task-filters">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search for Tasks..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="filter-dropdowns">
        <select 
          value={projectFilter}
          onChange={(e) => onProjectFilterChange(e.target.value)}
          className="filter-dropdown"
        >
          {projectOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        
        <select 
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="filter-dropdown"
        >
          {statusOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        
        <select 
          value={dueDateFilter}
          onChange={(e) => onDueDateFilterChange(e.target.value)}
          className="filter-dropdown"
        >
          {dueDateOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;