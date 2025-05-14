import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import projectsService, { ProjectTask } from '../../services/projectsService';
import { RootState } from '../index';

interface TasksState {
    tasks: ProjectTask[];
    currentTask: ProjectTask | null;
    isLoading: boolean;
    loadingTaskIds: (string | number)[]; 
    error: string | null;
    cellUpdateErrors: Record<string, string>; 
}

const initialState: TasksState = {
    tasks: [],
    currentTask: null,
    isLoading: false,
    loadingTaskIds: [],
    error: null,
    cellUpdateErrors: {}
};



export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectCurrentTask = (state: RootState) => state.tasks.currentTask;
export const selectTasksLoading = (state: RootState) => state.tasks.isLoading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectLoadingTaskIds = (state: RootState) => state.tasks.loadingTaskIds;
export const selectIsTaskLoading = (taskId: string | number) => (state: RootState) =>
    state.tasks.loadingTaskIds.includes(taskId);
export const selectCellUpdateErrors = (state: RootState) => state.tasks.cellUpdateErrors;




export const {
    selectTask,
    clearTasksError,
    clearTasks,
    optimisticUpdateTask,
    optimisticUpdateCell,
    clearCellUpdateError,
    startTaskLoading,
    stopTaskLoading
} = tasksSlice.actions;

export default tasksSlice.reducer; 