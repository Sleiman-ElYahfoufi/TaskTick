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

const TaskFilters: React.FC = () => {
  return (
    <div className="task-filters">
      
    </div>
  );
};

export default TaskFilters;