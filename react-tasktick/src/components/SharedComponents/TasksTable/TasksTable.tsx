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

export interface BaseTask {
  id: string;
  [key: string]: any;
}

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
  
  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    const updatedRow = { ...newRow } as T;
    
    if (onTaskUpdate) {
      onTaskUpdate(updatedRow);
    }
    
    return updatedRow;
  };

  return (
    <div className={`tasks-table-container ${className}`}>
      <DataGrid
        rows={tasks}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        hideFooterPagination={hideFooter}
        hideFooter={hideFooter || tasks.length <= 10}
        processRowUpdate={onTaskUpdate ? processRowUpdate : undefined}
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
            fontSize: '0.75rem',
            textTransform: 'uppercase',
          },
          '& .MuiDataGrid-cell': {
            padding: '12px 16px',
            borderBottom: '1px solid #e5e7eb',
          },
        }}
      />
    </div>
  );
}

export const renderPriorityCell = (params: GridRenderCellParams) => (
  <div className={`priority-badge ${params.value?.toString().toLowerCase()}`}>
    {params.value}
  </div>
);

export const renderProgressCell = (params: GridRenderCellParams) => (
  <div className="progress-bar-container">
    <div className="progress-bar-wrapper">
      <div 
        className="progress-bar"
        style={{ width: `${params.value}%` }}
      ></div>
    </div>
    <span className="progress-text">{params.value}%</span>
  </div>
);

export const renderTimerCell = (onStartTimer: (id: string) => void) => (params: GridRenderCellParams) => (
  <button 
    className={`timer-button ${params.row.status === 'Completed' ? 'completed' : ''}`}
    onClick={() => params.row.status !== 'Completed' && onStartTimer(params.row.id)}
    disabled={params.row.status === 'Completed'}
  >
    {params.row.status === 'Completed' ? 'Completed' : 'Start'}
  </button>
);

export const renderActionsCell = (
  onDeleteTask: (id: string) => void, 
  onEditTask: (id: string) => void
) => (params: GridRenderCellParams) => (
  <div className="action-buttons">
    <button 
      className="action-button delete"
      onClick={() => onDeleteTask(params.row.id)}
      title="Delete Task"
    >
      <DeleteIcon fontSize="small" />
    </button>
    <button 
      className="action-button edit"
      onClick={() => onEditTask(params.row.id)}
      title="Edit Task"
    >
      <EditIcon fontSize="small" />
    </button>
  </div>
);

export const renderStatusCell = (params: GridRenderCellParams) => (
  <div className={`status-badge ${params.value?.toString().toLowerCase().replace(/\s+/g, '-')}`}>
    {params.value}
  </div>
);

export const renderProjectCell = (params: GridRenderCellParams) => (
  <div className="project-badge">
    {params.value}
  </div>
);

export default TasksTable;