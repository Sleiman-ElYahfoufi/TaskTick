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







export default TasksTable;