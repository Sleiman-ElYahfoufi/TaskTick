import React, { useState, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import TasksTable, { 
  renderPriorityCell, 
  renderActionsCell, 
  renderStatusCell,
  renderProjectCell
} from '../../components/SharedComponents/TasksTable/TasksTable';
import CurrentTask from '../../components/SharedComponents/CurrentTask/CurrentTask'; 
import TaskFilters from '../../components/TasksComponents/TaskFilters/TaskFilters'; 
import TaskStats from '../../components/TasksComponents/TaskStats/TaskStats'; 
import './Tasks.css';

interface Task {
  id: string;
  name: string;
  project: string;
  estimatedTime: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  status: 'In Progress' | 'Completed' | 'Not Started';
}

const Tasks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('All Projects');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [dueDateFilter, setDueDateFilter] = useState('Due Date');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Current task data
  const currentTask = {
    name: 'Initial UI/UX Analysis',
    category: 'E-commerce',
    estimatedTime: '3/4 hrs',
    progress: 65,
    elapsedTime: '00:47:23',
    sessions: 4,
    totalTime: '2h 15m total'
  };

  const stats = {
    activeTasks: 7,
    completedTasks: 28,
    dueToday: 2,
    completedThisMonth: 'this month'
  };




  return (
    <div className="tasks-page">
    </div>
  );
};

export default Tasks;