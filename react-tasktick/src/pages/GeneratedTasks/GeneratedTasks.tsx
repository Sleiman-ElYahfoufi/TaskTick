import React, { useState } from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridRenderCellParams, 
  GridRowId,
  GridValueGetterParams,
  GridActionsCellItem,
  GridEventListener,
  GridRowModel
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import StepIndicator from '../../components/AddProjectComponents/StepIndicator/StepIndicator';
import './GeneratedTasks.css';

interface Task {
  id: string;
  name: string;
  estimatedTime: number;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

const GeneratedTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: uuidv4(), name: 'Initial UI/UX Analysis', estimatedTime: 4, dueDate: 'May 8th', priority: 'High' },
    { id: uuidv4(), name: 'Wireframe Creation', estimatedTime: 8, dueDate: 'May 9th', priority: 'High' },
    { id: uuidv4(), name: 'Homepage Design', estimatedTime: 6, dueDate: 'May 10th', priority: 'High' },
    { id: uuidv4(), name: 'Product Page Layout', estimatedTime: 5, dueDate: 'May 11th', priority: 'High' },
    { id: uuidv4(), name: 'Checkout Flow Implementation', estimatedTime: 8, dueDate: 'May 12th', priority: 'High' },
    { id: uuidv4(), name: 'Mobile Responsiveness', estimatedTime: 6, dueDate: 'May 13th', priority: 'High' },
    { id: uuidv4(), name: 'User Testing', estimatedTime: 3, dueDate: 'May 14th', priority: 'High' },
    { id: uuidv4(), name: 'Feedback Implementation', estimatedTime: 3, dueDate: 'May 15th', priority: 'High' },
  ]);

  const totalEstimatedTime = tasks.reduce((total, task) => total + task.estimatedTime, 0);

  const handleDeleteTask = (id: GridRowId) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: uuidv4(),
      name: '',
      estimatedTime: 2,
      dueDate: 'May 16th',
      priority: 'Medium'
    };
    setTasks([...tasks, newTask]);
  };

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    const updatedRow = { ...newRow };
    setTasks(tasks.map(task => task.id === newRow.id ? updatedRow as Task : task));
    return updatedRow;
  };

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'TASK NAME', 
      flex: 2, 
      editable: true 
    },
    { 
      field: 'estimatedTime', 
      headerName: 'ESTIMATED TIME', 
      flex: 1, 
      editable: true,
      renderCell: (params) => `${params.value} hrs` 
    },
    { 
      field: 'dueDate', 
      headerName: 'DUE DATE', 
      flex: 1, 
      editable: true 
    },
    { 
      field: 'priority', 
      headerName: 'PRIORITY', 
      flex: 1, 
      editable: true,
      type: 'singleSelect',
      valueOptions: ['High', 'Medium', 'Low'],
      renderCell: (params) => (
        <div className={`tasks-priority-badge ${params.value.toString().toLowerCase()}`}>
          {params.value}
        </div>
      )
    },
    { 
      field: 'actions', 
      headerName: 'ACTIONS', 
      type: 'actions', 
      flex: 0.5,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteTask(params.id)}
        />
      ]
    }
  ];

  return (
    <div className="generated-tasks-container">
      <h1 className="page-title">Generated Tasks</h1>
      
      <div className="generated-tasks-content">
        <div className="top-controls">
          <StepIndicator 
            steps={[
              { number: 1, label: 'Project Details' },
              { number: 2, label: 'Generated Tasks' }
            ]}
            currentStep={2}
          />
          
          <button className="add-task-btn" onClick={handleAddTask}>
            Add Task
          </button>
        </div>
        
        <div className="generated-tasks-project-summary">
          <div className="generated-tasks-project-info">
            <h2 className="generated-tasks-project-name">E-commerce Site Estimate</h2>
            
            <div className="generated-tasks-stats">
              <div className="generated-tasks-stat">
                <span className="generated-tasks-stat-label">Tasks Generated</span>
                <span className="generated-tasks-stat-value">{tasks.length} tasks</span>
              </div>
              
              <div className="generated-tasks-stat">
                <span className="generated-tasks-stat-label">Total Estimated Time</span>
                <span className="generated-tasks-stat-value">{totalEstimatedTime} hours</span>
              </div>
            </div>
          </div>
          
          <div className="generated-tasks-accuracy-badge">
            <span>97% Accurate</span>
          </div>
        </div>
        
        <div className="tasks-table">
          <DataGrid
            rows={tasks}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            processRowUpdate={processRowUpdate}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 }
              }
            }}
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f9fafb',
              },
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
              },
              '& .MuiDataGrid-columnHeader': {
                padding: '16px',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: '600',
                color: '#6b7280',
                fontSize: '0.875rem',
              },
              '& .MuiDataGrid-cell': {
                padding: '16px',
                borderBottom: '1px solid #e5e7eb',
              },
            }}
          />
        </div>
        
        <div className="actions-footer">
          <button className="create-project-btn">
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedTasks;