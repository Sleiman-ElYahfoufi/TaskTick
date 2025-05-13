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

  
  
  
  

  

  return (
    <div className="generated-tasks-container">
      
    </div>
  );
};

export default GeneratedTasksPage;