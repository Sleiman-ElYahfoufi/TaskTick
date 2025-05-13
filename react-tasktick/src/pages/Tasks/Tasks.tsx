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

  useEffect(() => {
    const mockTasks: Task[] = [
      { id: '1', name: 'Initial UI/UX Analysis', project: 'E-commerce Site', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
      { id: '2', name: 'Initial UI/UX Analysis', project: 'E-commerce Site', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
      { id: '3', name: 'Initial UI/UX Analysis', project: 'E-commerce Site', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
      { id: '4', name: 'Initial UI/UX Analysis', project: 'E-commerce Site', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
      { id: '5', name: 'Initial UI/UX Analysis', project: 'E-commerce Site', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
      { id: '6', name: 'Initial UI/UX Analysis', project: 'E-commerce Site', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
      { id: '7', name: 'Initial UI/UX Analysis', project: 'E-commerce Site', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
      { id: '8', name: 'Initial UI/UX Analysis', project: 'E-commerce Site', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
    ];
    
    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
  }, []);

  useEffect(() => {
    let result = [...tasks];

    if (searchTerm) {
      result = result.filter(task => 
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.project.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (projectFilter !== 'All Projects') {
      result = result.filter(task => task.project === projectFilter);
    }

    if (statusFilter !== 'All Statuses') {
      result = result.filter(task => task.status === statusFilter);
    }

    if (dueDateFilter === 'Due Today') {
      result = result.filter(task => task.dueDate === 'May 8th'); 
    }

    setFilteredTasks(result);
  }, [searchTerm, projectFilter, statusFilter, dueDateFilter, tasks]);

  const handleStartTimer = (taskId: string) => {
    console.log('Start timer for task:', taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEditTask = (taskId: string) => {
    console.log('Edit task:', taskId);
  };

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'TASK NAME', 
      flex: 2, 
      minWidth: 180,
      editable: true 
    },
    { 
      field: 'project', 
      headerName: 'PROJECT', 
      flex: 1.5, 
      minWidth: 150,
      editable: true,
      renderCell: renderProjectCell 
    },
    { 
      field: 'estimatedTime', 
      headerName: 'ETC', 
      flex: 1, 
      minWidth: 100,
      editable: true 
    },
    { 
      field: 'dueDate', 
      headerName: 'DUE DATE', 
      flex: 1, 
      minWidth: 110,
      editable: true 
    },
    { 
      field: 'status', 
      headerName: 'STATUS', 
      flex: 1, 
      minWidth: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['In Progress', 'Completed', 'Not Started'],
      renderCell: renderStatusCell
    },
    { 
      field: 'actions', 
      headerName: 'ACTIONS', 
      flex: 1, 
      minWidth: 100,
      renderCell: renderActionsCell(handleDeleteTask, handleEditTask)
    },
  ];

  return (
    <div className="tasks-page">
     
    </div>
  );
};

export default Tasks;