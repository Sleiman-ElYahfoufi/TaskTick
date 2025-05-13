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
import './GeneratedTasksPage.css';

interface Task {
  id: string;
  name: string;
  estimatedTime: number;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

const GeneratedTasksPage: React.FC = () => {
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
     
    </div>
  );
};

export default GeneratedTasksPage;