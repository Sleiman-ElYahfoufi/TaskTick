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


const Tasks: React.FC = () => {






  return (
    <div className="tasks-page">
    </div>
  );
};

export default Tasks;