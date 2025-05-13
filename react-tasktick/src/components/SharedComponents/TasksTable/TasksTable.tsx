import React from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridRenderCellParams, 
  GridRowModel,
  GridEventListener
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './TasksTable.css';


interface TasksTableProps<T extends BaseTask> {
  tasks: T[];
  columns: GridColDef[];
  onStartTimer?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  onTaskUpdate?: (updatedTask: T) => void;
  hideFooter?: boolean;
  className?: string;
}

function TasksTable<T extends BaseTask>({
  tasks,
  columns,
  onStartTimer,
  onDeleteTask,
  onEditTask,
  onTaskUpdate,
  hideFooter = false,
  className = ''
}: TasksTableProps<T>) {
  
  // Handle cell edit if onTaskUpdate is provided
  
  return (
    <div className={`tasks-table-container ${className}`}>
     
    </div>
  );
}












export default TasksTable;