import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import projectsService, { Project, ProjectsResponse } from '../../services/projectsService';
import { RootState } from '../index';

interface ProjectsState {
    projects: Project[];
    selectedProject: Project | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ProjectsState = {
    projects: [],
    selectedProject: null,
    isLoading: false,
    error: null
};

const setPending = (state: ProjectsState) => {
    state.isLoading = true;
    state.error = null;
};

const setFailed = (state: ProjectsState, action: any) => {
    state.isLoading = false;
    state.error = action.payload?.message || action.error?.message || action.payload || 'An error occurred';
};

export const fetchProjects = createAsyncThunk<Project[] | ProjectsResponse, number>(
    'projects/fetchProjects',
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await projectsService.getUserProjects(userId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch projects');
        }
    }
);

export const fetchProjectById = createAsyncThunk<Project, string | number>(
    'projects/fetchProjectById',
    async (projectId: string | number, { rejectWithValue }) => {
        try {
            const project = await projectsService.getProjectById(projectId);
            return project;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch project');
        }
    }
);

export const addProject = createAsyncThunk<Project, Omit<Project, 'id'>>(
    'projects/addProject',
    async (projectData: Omit<Project, 'id'>, { rejectWithValue }) => {
        try {
            const newProject = await projectsService.createProject(projectData);
            return newProject;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to add project');
        }
    }
);

export const updateProject = createAsyncThunk<Project, { projectId: string | number, projectData: Partial<Project> }>(
    'projects/updateProject',
    async ({ projectId, projectData }, { rejectWithValue }) => {
        try {
            const updatedProject = await projectsService.updateProject(projectId, projectData);
            return updatedProject;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update project');
        }
    }
);

export const deleteProject = createAsyncThunk<string | number, string | number>(
    'projects/deleteProject',
    async (projectId: string | number, { rejectWithValue }) => {
        try {
            await projectsService.deleteProject(projectId);
            return projectId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete project');
        }
    }
);

export const selectAllProjects = (state: RootState) => state.projects.projects;
export const selectSelectedProject = (state: RootState) => state.projects.selectedProject;
export const selectProjectsLoading = (state: RootState) => state.projects.isLoading;
export const selectProjectsError = (state: RootState) => state.projects.error;

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        selectProject: (state, action: PayloadAction<string | number>) => {
            const projectId = action.payload;
            state.selectedProject = state.projects.find(project =>
                String(project.id) === String(projectId)) || null;
        },
        clearProjectsError: (state) => {
            state.error = null;
        },
        clearSelectedProject: (state) => {
            state.selectedProject = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProjects.pending, setPending);
        builder.addCase(fetchProjects.fulfilled, (state, action) => {
            state.isLoading = false;
            if (Array.isArray(action.payload)) {
                state.projects = action.payload;
            } else if (action.payload && typeof action.payload === 'object') {
                state.projects = action.payload.projects || [];
            } else {
                state.projects = [];
            }
        });
        builder.addCase(fetchProjects.rejected, setFailed);

        builder.addCase(fetchProjectById.pending, setPending);
        builder.addCase(fetchProjectById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.selectedProject = action.payload;

            const index = state.projects.findIndex(p => String(p.id) === String(action.payload.id));
            if (index !== -1) {
                state.projects[index] = action.payload;
            } else {
                state.projects.push(action.payload);
            }
        });
        builder.addCase(fetchProjectById.rejected, setFailed);

        builder.addCase(addProject.pending, setPending);
        builder.addCase(addProject.fulfilled, (state, action) => {
            state.isLoading = false;
            state.projects.push(action.payload);
            state.selectedProject = action.payload;
        });
        builder.addCase(addProject.rejected, setFailed);

        builder.addCase(updateProject.pending, setPending);
        builder.addCase(updateProject.fulfilled, (state, action) => {
            state.isLoading = false;
            const index = state.projects.findIndex(p => String(p.id) === String(action.payload.id));

            if (index !== -1) {
                const existingProject = state.projects[index];
                const updatedProject = {
                    ...action.payload,
                    completedTasks: action.payload.completedTasks ?? existingProject.completedTasks ?? 0,
                    totalTasks: action.payload.totalTasks ?? existingProject.totalTasks ?? 0,
                    status: action.payload.status ?? existingProject.status
                };

                state.projects[index] = updatedProject;
            }
            if (state.selectedProject && String(state.selectedProject.id) === String(action.payload.id)) {
                const updatedSelectedProject = {
                    ...action.payload,
                    completedTasks: action.payload.completedTasks ?? state.selectedProject.completedTasks ?? 0,
                    totalTasks: action.payload.totalTasks ?? state.selectedProject.totalTasks ?? 0,
                    status: action.payload.status ?? state.selectedProject.status
                };
                state.selectedProject = updatedSelectedProject;
            }
        });
        builder.addCase(updateProject.rejected, setFailed);

        builder.addCase(deleteProject.pending, setPending);
        builder.addCase(deleteProject.fulfilled, (state, action) => {
            state.isLoading = false;
            state.projects = state.projects.filter(p => String(p.id) !== String(action.payload));
            if (state.selectedProject && String(state.selectedProject.id) === String(action.payload)) {
                state.selectedProject = null;
            }
        });
        builder.addCase(deleteProject.rejected, setFailed);
    },
});

export const { selectProject, clearProjectsError, clearSelectedProject } = projectsSlice.actions;
export default projectsSlice.reducer; 