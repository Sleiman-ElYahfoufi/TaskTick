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


export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (projectId: string | number, { rejectWithValue }) => {
        try {
            const tasks = await projectsService.getProjectTasks(projectId);
            return tasks;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch tasks');
        }
    }
);

export const addTask = createAsyncThunk(
    'tasks/addTask',
    async ({ projectId, task }: { projectId: string | number, task: Partial<ProjectTask> }, { rejectWithValue }) => {
        try {
            const newTask = await projectsService.addProjectTask(projectId, task);
            return newTask;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to add task');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ projectId, taskId, taskData }: {
        projectId: string | number,
        taskId: string | number,
        taskData: Partial<ProjectTask>
    }, { rejectWithValue }) => {
        try {
            const updatedTask = await projectsService.updateProjectTask(projectId, taskId, taskData);
            return updatedTask;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update task');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async ({ projectId, taskId }: { projectId: string | number, taskId: string | number }, { rejectWithValue }) => {
        try {
            await projectsService.deleteProjectTask(projectId, taskId);
            return taskId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete task');
        }
    }
);


export const updateTaskCell = createAsyncThunk(
    'tasks/updateTaskCell',
    async ({
        projectId,
        taskId,
        field,
        value
    }: {
        projectId: string | number;
        taskId: string | number;
        field: string;
        value: any;
    }, { rejectWithValue }) => {
        try {
          
            const taskData = { [field]: value } as Partial<ProjectTask>;

            const updatedTask = await projectsService.updateProjectTask(projectId, taskId, taskData);
            return { taskId, updatedTask };
        } catch (error: any) {
            return rejectWithValue({
                taskId,
                field,
                error: error.message || `Failed to update ${field}`
            });
        }
    }
);

export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectCurrentTask = (state: RootState) => state.tasks.currentTask;
export const selectTasksLoading = (state: RootState) => state.tasks.isLoading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectLoadingTaskIds = (state: RootState) => state.tasks.loadingTaskIds;
export const selectIsTaskLoading = (taskId: string | number) => (state: RootState) =>
    state.tasks.loadingTaskIds.includes(taskId);
export const selectCellUpdateErrors = (state: RootState) => state.tasks.cellUpdateErrors;





const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        selectTask: (state, action: PayloadAction<string | number>) => {
            const taskId = action.payload;
            state.currentTask = state.tasks.find(task => String(task.id) === String(taskId)) || null;
        },
        clearTasksError: (state) => {
            state.error = null;
        },
        clearTasks: (state) => {
            state.tasks = [];
            state.currentTask = null;
        },
        
        optimisticUpdateTask: (state, action: PayloadAction<Partial<ProjectTask> & { id: string | number }>) => {
            const { id, ...updatedFields } = action.payload;
            const index = state.tasks.findIndex(task => String(task.id) === String(id));

            if (index !== -1) {
                state.tasks[index] = { ...state.tasks[index], ...updatedFields };

                if (state.currentTask && String(state.currentTask.id) === String(id)) {
                    state.currentTask = { ...state.currentTask, ...updatedFields };
                }
            }
        },

        optimisticUpdateCell: (state, action: PayloadAction<{ taskId: string | number; field: string; value: any }>) => {
            const { taskId, field, value } = action.payload;
            const index = state.tasks.findIndex(task => String(task.id) === String(taskId));

            if (index !== -1) {
                if (state.cellUpdateErrors[`${taskId}_${field}`]) {
                    delete state.cellUpdateErrors[`${taskId}_${field}`];
                }

                state.tasks[index] = {
                    ...state.tasks[index],
                    [field]: value
                };

                if (state.currentTask && String(state.currentTask.id) === String(taskId)) {
                    state.currentTask = {
                        ...state.currentTask,
                        [field]: value
                    };
                }
            }
        },
        clearCellUpdateError: (state, action: PayloadAction<{ taskId: string | number; field: string }>) => {
            const { taskId, field } = action.payload;
            delete state.cellUpdateErrors[`${taskId}_${field}`];
        },
        startTaskLoading: (state, action: PayloadAction<string | number>) => {
            if (!state.loadingTaskIds.includes(action.payload)) {
                state.loadingTaskIds.push(action.payload);
            }
        },
        stopTaskLoading: (state, action: PayloadAction<string | number>) => {
            state.loadingTaskIds = state.loadingTaskIds.filter(id => id !== action.payload);
        }
    },
    extraReducers: (builder) => {},
});

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