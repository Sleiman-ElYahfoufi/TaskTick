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

export const fetchProjects = createAsyncThunk<ProjectsResponse | Project[], number>(
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

export const fetchProjectById = createAsyncThunk(
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
                state.projects[index] = action.payload;
            }
            if (state.selectedProject && String(state.selectedProject.id) === String(action.payload.id)) {
                state.selectedProject = action.payload;
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