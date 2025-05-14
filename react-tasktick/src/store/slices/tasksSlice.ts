import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import projectsService, { ProjectTask } from '../../services/projectsService';
import { RootState } from '../index';

interface TasksState {
    tasks: ProjectTask[];
    currentTask: ProjectTask | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: TasksState = {
    tasks: [],
    currentTask: null,
    isLoading: false,
    error: null
};

export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectCurrentTask = (state: RootState) => state.tasks.currentTask;
export const selectTasksLoading = (state: RootState) => state.tasks.isLoading;
export const selectTasksError = (state: RootState) => state.tasks.error;

const setPending = (state: TasksState) => {
    state.isLoading = true;
    state.error = null;
};

const setFailed = (state: TasksState, action: PayloadAction<any>) => {
    state.isLoading = false;
    state.error = action.payload as string;
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {}
});

export default tasksSlice.reducer;