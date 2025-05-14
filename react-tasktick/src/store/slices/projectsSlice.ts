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
  
});

export const { selectProject, clearProjectsError, clearSelectedProject } = projectsSlice.actions;
export default projectsSlice.reducer; 