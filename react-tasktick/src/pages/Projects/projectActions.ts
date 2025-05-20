import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../../store";
import {
    fetchProjects,
    updateProject,
    deleteProject
} from "../../store/slices/projectsSlice";
import { ProjectData, mapStatusToAPI } from "./projectFunctions";
import { Project } from "../../services/projectsService";

export interface UpdateProjectData {
    title: string;
    description: string;
    deadline?: string | null;
}

export const handleUpdateProject = (
    projectId: string,
    updatedData: UpdateProjectData,
    user: { id: string } | null,
    existingProject: ProjectData,
    currentStatus: string,
    dispatch: AppDispatch,
    setUpdatingProjectId: (id: string | null) => void,
    setLocalProjectUpdates: (
        updater: (prev: Record<string, Partial<ProjectData>>) => Record<string, Partial<ProjectData>>
    ) => void,
    setFilteredProjects: (
        updater: (prev: ProjectData[]) => ProjectData[]
    ) => void
) => {
    if (!user?.id) return;

    setUpdatingProjectId(projectId);

    // Create local update for UI responsiveness
    const updatedLocalProject: Partial<ProjectData> = {
        id: projectId,
        name: updatedData.title,
        title: updatedData.title,
        description: updatedData.description,
        deadline: updatedData.deadline,
        status: currentStatus,
        estimated_time: existingProject.estimated_time,
        estimatedHours: existingProject.estimatedHours,
        completedTasks: existingProject.completedTasks || 0,
        totalTasks: existingProject.totalTasks || 0,
    };

    // Update local state immediately
    setLocalProjectUpdates((prev) => ({
        ...prev,
        [projectId]: updatedLocalProject,
    }));

    // Create API request data
    const projectData = {
        name: updatedData.title,
        description: updatedData.description,
        deadline: updatedData.deadline,
        estimated_time: existingProject.estimated_time,
        status: mapStatusToAPI(currentStatus),
        priority: existingProject.priority || "medium",
        detail_depth: existingProject.detail_depth || "normal",
    };

    // Dispatch update action
    dispatch(
        updateProject({
            projectId,
            projectData,
        } as { projectId: string; projectData: Partial<Project> })
    ).then((action) => {
        if (action.meta.requestStatus === "fulfilled") {
            if (action.payload) {
                const payload = action.payload as any;

                // Process API response
                const updatedProject: Partial<ProjectData> = {
                    id: projectId,
                    name: payload.name || updatedData.title,
                    title: payload.name || updatedData.title,
                    description: payload.description || updatedData.description,
                    deadline: payload.deadline !== undefined ? payload.deadline : updatedData.deadline,
                    completedTasks: existingProject.completedTasks || 0,
                    totalTasks: existingProject.totalTasks || 0,
                    estimated_time: payload.estimated_time !== undefined && payload.estimated_time !== null
                        ? payload.estimated_time
                        : existingProject.estimated_time,
                    status: payload.status ? mapStatusToAPI(payload.status) : currentStatus,
                    updated_at: payload.updated_at || existingProject.updated_at,
                };

                // Apply final updated project data
                const updateProject = (project: ProjectData) => {
                    if (String(project.id) === projectId) {
                        return { ...project, ...updatedProject };
                    }
                    return project;
                };

                setFilteredProjects((prev) => prev.map(updateProject));

                // Clear local updates
                setLocalProjectUpdates((prev) => {
                    const newUpdates = { ...prev };
                    delete newUpdates[projectId];
                    return newUpdates;
                });
            }
        } else {

            "Project update failed:",
                action.meta.requestStatus === "rejected"
                    ? action.payload
                    : "Unknown error"
            );
}
setUpdatingProjectId(null);
    });
};

export const handleDeleteProject = (
    projectId: string,
    user: { id: string } | null,
    dispatch: AppDispatch,
    setUpdatingProjectId: (id: string | null) => void,
    setFilteredProjects: (updater: (prev: ProjectData[]) => ProjectData[]) => void
) => {
    if (!user?.id) return;

    setUpdatingProjectId(projectId);

    dispatch(deleteProject(projectId)).then((action) => {
        if (action.meta.requestStatus === "fulfilled") {
            setFilteredProjects((prev) =>
                prev.filter((project) => String(project.id) !== projectId)
            );
        }
        setUpdatingProjectId(null);
    });
};

export const handleViewProjectDetails = (
    projectId: string,
    navigate: NavigateFunction
) => {
    navigate(`/dashboard/projects/${projectId}`);
};

export const handleNewProject = (navigate: NavigateFunction) => {
    navigate("/dashboard/projects/new");
};

export const handleRetryFetchProjects = (
    user: { id: string } | null,
    dispatch: AppDispatch
) => {
    if (user?.id) {
        dispatch(fetchProjects(parseInt(user.id)));
    }
}; 