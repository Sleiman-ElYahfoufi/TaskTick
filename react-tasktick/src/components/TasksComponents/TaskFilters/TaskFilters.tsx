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
      
    </div>
  );
};

export default TaskFilters;