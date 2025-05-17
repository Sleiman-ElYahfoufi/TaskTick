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
    async ({ projectId, task }: { projectId: string | number, task: Partial<ProjectTask> }, { dispatch }) => {
        const tempId = `temp-${Date.now()}`;

        try {

            const taskName = (!task.name || task.name.trim() === '') ? 'New Task' : task.name;

            const optimisticTask = {
                ...task,
                id: tempId,
                name: taskName,
            } as ProjectTask;

            dispatch(addTaskOptimistic(optimisticTask));


            const taskToSave = {
                ...task,
                name: taskName
            };
            const newTask = await projectsService.addProjectTask(projectId, taskToSave);

            dispatch(replaceOptimisticTask({ tempId, newTask }));

            return newTask;
        } catch (error: any) {
            dispatch(removeOptimisticTask(tempId));
            throw error;
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

            if (taskData.name !== undefined && (!taskData.name || taskData.name.trim() === '')) {
                taskData.name = "New Task";
            }

            const updatedTask = await projectsService.updateProjectTask(projectId, taskId, taskData);
            return updatedTask;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update task');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async ({ taskId }: { taskId: string | number }, { rejectWithValue }) => {
        try {
            await projectsService.deleteProjectTask(taskId);
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

            if (field === 'name' && (!value || value.trim() === '')) {
                value = "New Task";
            }

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

        addTaskOptimistic: (state, action: PayloadAction<ProjectTask>) => {
            state.tasks.unshift(action.payload);
        },

        replaceOptimisticTask: (state, action: PayloadAction<{ tempId: string, newTask: ProjectTask }>) => {
            const { tempId, newTask } = action.payload;
            const index = state.tasks.findIndex(task => String(task.id) === String(tempId));
            if (index !== -1) {
                state.tasks[index] = newTask;
            }
        },

        removeOptimisticTask: (state, action: PayloadAction<string>) => {
            const tempId = action.payload;
            state.tasks = state.tasks.filter(task => String(task.id) !== String(tempId));
        },

        optimisticUpdateTask: (state, action: PayloadAction<Partial<ProjectTask> & { id: string | number }>) => {
            const { id, ...updatedFields } = action.payload;
            const index = state.tasks.findIndex(task => String(task.id) === String(id));

            if (index !== -1) {

                const validatedFields = { ...updatedFields };
                if (validatedFields.name !== undefined && (!validatedFields.name || validatedFields.name.trim() === '')) {
                    validatedFields.name = 'New Task';
                }

                state.tasks[index] = { ...state.tasks[index], ...validatedFields };

                if (state.currentTask && String(state.currentTask.id) === String(id)) {
                    state.currentTask = { ...state.currentTask, ...validatedFields };
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


                let finalValue = value;
                if (field === 'name' && (!value || value.trim() === '')) {
                    finalValue = 'New Task';
                }

                state.tasks[index] = {
                    ...state.tasks[index],
                    [field]: finalValue
                };

                if (state.currentTask && String(state.currentTask.id) === String(taskId)) {
                    state.currentTask = {
                        ...state.currentTask,
                        [field]: finalValue
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
    extraReducers: (builder) => {
        builder.addCase(fetchTasks.pending, setPending);
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state.isLoading = false;
            state.tasks = action.payload;

            const inProgressTask = action.payload.find(task =>
                task.status === 'In Progress' || task.status === 'in_progress' || task.status === 'in progress');

            state.currentTask = inProgressTask || (action.payload.length > 0 ? action.payload[0] : null);
        });
        builder.addCase(fetchTasks.rejected, setFailed);

        builder.addCase(addTask.rejected, (state, action) => {
            state.error = action.payload as string || 'Failed to add task';
        });

        builder.addCase(updateTask.pending, (state, action) => {
            const taskId = action.meta.arg.taskId;
            if (!state.loadingTaskIds.includes(taskId)) {
                state.loadingTaskIds.push(taskId);
            }
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const taskId = String(action.payload.id);
            state.loadingTaskIds = state.loadingTaskIds.filter(id => String(id) !== taskId);

            const index = state.tasks.findIndex(task => String(task.id) === taskId);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }

            if (state.currentTask && String(state.currentTask.id) === taskId) {
                state.currentTask = action.payload;
            }
        });
        builder.addCase(updateTask.rejected, (state, action) => {
            const taskId = action.meta.arg.taskId;
            state.loadingTaskIds = state.loadingTaskIds.filter(id => String(id) !== String(taskId));
            state.error = action.payload as string || 'Failed to update task';
        });

        builder.addCase(deleteTask.pending, (state, action) => {
            const taskId = action.meta.arg.taskId;
            if (!state.loadingTaskIds.includes(taskId)) {
                state.loadingTaskIds.push(taskId);
            }
        });
        builder.addCase(deleteTask.fulfilled, (state, action) => {
            const taskId = action.payload;
            state.loadingTaskIds = state.loadingTaskIds.filter(id => String(id) !== String(taskId));
            state.tasks = state.tasks.filter(task => String(task.id) !== String(taskId));

            if (state.currentTask && String(state.currentTask.id) === String(taskId)) {
                state.currentTask = state.tasks.length > 0 ? state.tasks[0] : null;
            }
        });
        builder.addCase(deleteTask.rejected, (state, action) => {
            const taskId = action.meta.arg.taskId;
            state.loadingTaskIds = state.loadingTaskIds.filter(id => String(id) !== String(taskId));
            state.error = action.payload as string || 'Failed to delete task';
        });

        builder.addCase(updateTaskCell.pending, (state, action) => {
            const taskId = action.meta.arg.taskId;
            if (!state.loadingTaskIds.includes(taskId)) {
                state.loadingTaskIds.push(taskId);
            }
        });

        builder.addCase(updateTaskCell.fulfilled, (state, action) => {
            const { taskId, updatedTask } = action.payload;
            state.loadingTaskIds = state.loadingTaskIds.filter(id => String(id) !== String(taskId));

            const index = state.tasks.findIndex(task => String(task.id) === String(taskId));
            if (index !== -1) {
                state.tasks[index] = updatedTask;

                if (state.currentTask && String(state.currentTask.id) === String(taskId)) {
                    state.currentTask = updatedTask;
                }
            }
        });

        builder.addCase(updateTaskCell.rejected, (state, action) => {
            const payload = action.payload as { taskId: string | number; field: string; error: string } ||
                { taskId: action.meta.arg.taskId, field: action.meta.arg.field, error: 'Unknown error' };

            const { taskId, field, error } = payload;

            state.loadingTaskIds = state.loadingTaskIds.filter(id => String(id) !== String(taskId));

            state.cellUpdateErrors[`${taskId}_${field}`] = error;

            state.error = `Failed to update ${field}: ${error}`;
        });
    },
});

export const {
    selectTask,
    clearTasksError,
    clearTasks,
    addTaskOptimistic,
    replaceOptimisticTask,
    removeOptimisticTask,
    optimisticUpdateTask,
    optimisticUpdateCell,
    clearCellUpdateError,
    startTaskLoading,
    stopTaskLoading
} = tasksSlice.actions;

export default tasksSlice.reducer; 