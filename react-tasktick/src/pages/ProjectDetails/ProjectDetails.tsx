import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GridColDef } from '@mui/x-data-grid';
import ProjectOverviewCard from '../../components/ProjectDetailsComponents/ProjectOverviewCard/ProjectOverviewCard';
import CurrentTask from '../../components/SharedComponents/CurrentTask/CurrentTask'; 
import TasksTable, { 
  renderPriorityCell, 
  renderActionsCell, 
  renderStatusCell,
  renderProgressCell
} from '../../components/SharedComponents/TasksTable/TasksTable'; 
import './ProjectDetails.css';

interface Task {
  id: string;
  name: string;
  estimatedTime: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState({
    id: projectId || '1',
    name: 'E-commerce Site Estimate',
    accuracy: 97,
    completedTasks: 10,
    totalTasks: 14,
    timeSpent: 23,
    totalEstimatedTime: 43,
    currentTask: {
      id: 'task-1',
      name: 'Initial UI/UX Analysis',
      category: 'E-commerce',
      estimatedTime: '3/4 hrs',
      progress: 65,
      elapsedTime: '00:47:23'
    }
  });
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'task-1', name: 'Initial UI/UX Analysis', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
    { id: 'task-2', name: 'Initial UI/UX Analysis', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
    { id: 'task-3', name: 'Initial UI/UX Analysis', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
    { id: 'task-4', name: 'Initial UI/UX Analysis', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
    { id: 'task-5', name: 'Initial UI/UX Analysis', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
    { id: 'task-6', name: 'Initial UI/UX Analysis', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'Completed' },
    { id: 'task-7', name: 'Initial UI/UX Analysis', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 50, status: 'In Progress' },
    { id: 'task-8', name: 'Initial UI/UX Analysis', estimatedTime: '3/4 hrs', dueDate: 'May 8th', priority: 'High', progress: 75, status: 'In Progress' },
  ]);
  
  const handleAddTask = () => {
    const newEmptyTask: Task = {
      id: `task-${Date.now()}`,
      name: 'New Task',
      estimatedTime: '0/1 hrs',
      dueDate: 'Not set',
      priority: 'Medium',
      progress: 0,
      status: 'Not Started'
    };
    
    setTasks([...tasks, newEmptyTask]);
  };
  
  const handleStartTimer = (taskId: string) => {
    console.log('Start timer for task:', taskId);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const handleEditTask = (taskId: string) => {
    console.log('Edit task:', taskId);
  };
  
  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
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
      field: 'estimatedTime', 
      headerName: 'ETC', 
      flex: 1, 
      minWidth: 80,
      align: 'center',
      headerAlign: 'center',
      editable: true
    },
    { 
      field: 'dueDate', 
      headerName: 'DUE DATE', 
      flex: 1, 
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      editable: true
    },
    { 
      field: 'priority', 
      headerName: 'PRIORITY', 
      flex: 1, 
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      type: 'singleSelect',
      valueOptions: ['High', 'Medium', 'Low'],
      renderCell: renderPriorityCell
    },
    { 
      field: 'progress', 
      headerName: 'PROGRESS', 
      flex: 1.5, 
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      type: 'number',
      renderCell: renderProgressCell
    },
    { 
      field: 'status', 
      headerName: 'TIMER', 
      flex: 1, 
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <button 
          className={`timer-button ${params.row.status === 'Completed' ? 'completed' : ''}`}
          onClick={() => params.row.status !== 'Completed' && handleStartTimer(params.row.id)}
          disabled={params.row.status === 'Completed'}
        >
          {params.row.status === 'Completed' ? 'Completed' : 'Start'}
        </button>
      )
    },
    { 
      field: 'actions', 
      headerName: 'ACTIONS', 
      flex: 1, 
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: renderActionsCell(handleDeleteTask, handleEditTask)
    },
  ];
  
  return (
    <div className="project-details-page">
      <div className="project-details-header">
        <h1>Projects</h1>
        <button className="back-button" onClick={() => navigate('/dashboard/projects')}>
          Back to Projects
        </button>
      </div>
      
      <div className="project-details-content">
        <ProjectOverviewCard 
          name={project.name}
          accuracy={project.accuracy}
          completedTasks={project.completedTasks}
          totalTasks={project.totalTasks}
          timeSpent={project.timeSpent}
          totalEstimatedTime={project.totalEstimatedTime}
        />
        
        <div className="tasks-header">
          <CurrentTask
            taskName={project.currentTask.name}
            category={project.currentTask.category}
            estimatedTime={project.currentTask.estimatedTime}
            progress={project.currentTask.progress}
            elapsedTime={project.currentTask.elapsedTime}
            sessions={4}
            totalTime="2h 15m total"
          />
          
          <button className="add-task-button" onClick={handleAddTask}>
            Add Task
          </button>
        </div>
        
      
      </div>
    </div>
  );
};

export default ProjectDetails;