import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import { RootState } from "../../store";
import { fetchProjects } from "../../store/slices/projectsSlice";
import { ProjectData, applyFilters } from "./projectFunctions";
import {
    handleUpdateProject as updateProject,
    handleDeleteProject as deleteProject,
    handleViewProjectDetails,
    handleNewProject,
    handleRetryFetchProjects,
    UpdateProjectData
} from "./projectActions";

// Hook for project filtering and sorting
export const useProjectFilters = (projects: ProjectData[]) => {
    const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Last Updated");
    const [localProjectUpdates, setLocalProjectUpdates] = useState<
        Record<string, Partial<ProjectData>>
    >({});

    // Apply filters when dependencies change
    useEffect(() => {
        if (projects && projects.length > 0) {
            const mergedProjects = projects.map((project) => {
                const localUpdate = localProjectUpdates[String(project.id)];
                return localUpdate ? { ...project, ...localUpdate } : project;
            });

            const filtered = applyFilters(
                searchTerm,
                activeFilter,
                sortBy,
                mergedProjects
            );
            setFilteredProjects(filtered);
        } else {
            setFilteredProjects([]);
        }
    }, [projects, localProjectUpdates, searchTerm, activeFilter, sortBy]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };

    const handleSortChange = (sort: string) => {
        setSortBy(sort);
    };

    const resetFilters = () => {
        setSearchTerm("");
        setActiveFilter("All");
        setSortBy("Last Updated");
        setFilteredProjects(projects);
    };

    return {
        filteredProjects,
        setFilteredProjects,
        searchTerm,
        activeFilter,
        sortBy,
        localProjectUpdates,
        setLocalProjectUpdates,
        handleSearch,
        handleFilterChange,
        handleSortChange,
        resetFilters
    };
};

// Hook for fetching projects
export const useProjectData = () => {
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { projects, isLoading, error } = useSelector(
        (state: RootState) => state.projects
    );
    const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null);

    // Fetch projects on mount or when user changes
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchProjects(parseInt(user.id)));
        }
    }, [dispatch, user]);

    const retryFetch = () => {
        handleRetryFetchProjects(user, dispatch);
    };

    return {
        projects,
        isLoading,
        error,
        user,
        updatingProjectId,
        setUpdatingProjectId,
        retryFetch
    };
};

// Hook for project operations
export const useProjectOperations = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null);

    const updateProjectHandler = (
        projectId: string,
        updatedData: UpdateProjectData,
        existingProject: ProjectData,
        currentStatus: string,
        setLocalProjectUpdates: (
            updater: (prev: Record<string, Partial<ProjectData>>) => Record<string, Partial<ProjectData>>
        ) => void,
        setFilteredProjects: (
            updater: (prev: ProjectData[]) => ProjectData[]
        ) => void
    ) => {
        if (!user?.id) return;

        updateProject(
            projectId,
            updatedData,
            user,
            existingProject,
            currentStatus,
            dispatch,
            setUpdatingProjectId,
            setLocalProjectUpdates,
            setFilteredProjects
        );
    };

    const deleteProjectHandler = (
        projectId: string,
        setFilteredProjects: (updater: (prev: ProjectData[]) => ProjectData[]) => void
    ) => {
        deleteProject(
            projectId,
            user,
            dispatch,
            setUpdatingProjectId,
            setFilteredProjects
        );
    };

    const viewProjectDetails = (projectId: string) => {
        handleViewProjectDetails(projectId, navigate);
    };

    const createNewProject = () => {
        handleNewProject(navigate);
    };

    return {
        updateProject: updateProjectHandler,
        deleteProject: deleteProjectHandler,
        viewProjectDetails,
        createNewProject,
        updatingProjectId,
        setUpdatingProjectId
    };
}; 