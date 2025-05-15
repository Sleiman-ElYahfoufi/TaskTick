import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard, {
    ProjectStatus,
} from "../../components/ProjectsComponents/ProjectCard/ProjectCard";
import ProjectFilters from "../../components/ProjectsComponents/ProjectFilters/ProjectFilters";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAppDispatch } from "../../store/hooks";
import {
    fetchProjects,
    updateProject,
    deleteProject,
} from "../../store/slices/projectsSlice";
import "./Projects.css";

import CircularProgress from "@mui/material/CircularProgress";

interface ProjectData {
    id: number | string;
    name?: string;
    title?: string;
    description?: string;
    status: string;
    estimated_time?: number;
    estimatedHours?: string;
    created_at?: string;
    updated_at?: string;
    tasks?: any[];
    totalTasks?: number;
    completedTasks?: number;
    deadline?: string | null;
}

const Projects: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.auth);
    const { projects, isLoading, error } = useSelector(
        (state: RootState) => state.projects
    );

    const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Last Updated");
    const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(
        null
    );
    const [localProjectUpdates, setLocalProjectUpdates] = useState<
        Record<string, Partial<ProjectData>>
    >({});

    useEffect(() => {
        // Only fetch projects if user is authenticated
        if (user?.id) {
            // @ts-ignore: Dispatch type inference issue
            dispatch(fetchProjects(parseInt(user.id)));
        }
    }, [dispatch, user]);

    // Update filtered projects whenever projects array or localProjectUpdates changes
    useEffect(() => {
        if (projects && projects.length > 0) {
            // Create a merged array by applying local updates over projects
            const mergedProjects = projects.map((project) => {
                const localUpdate = localProjectUpdates[String(project.id)];
                return localUpdate ? { ...project, ...localUpdate } : project;
            });

            applyFilters(searchTerm, activeFilter, sortBy, mergedProjects);
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

    const handleUpdateProject = (
        projectId: string,
        updatedData: {
            title: string;
            description: string;
            deadline?: string | null;
        }
    ) => {
        if (!user?.id) return;

        setUpdatingProjectId(projectId);

        // Find the current project
        const existingProject = projects.find(
            (p) => String(p.id) === projectId
        );
        if (!existingProject) {
            console.error("Project not found for updating");
            setUpdatingProjectId(null);
            return;
        }

        // Update local state immediately for a responsive UI
        const updatedLocalProject: Partial<ProjectData> = {
            id: projectId,
            name: updatedData.title,
            title: updatedData.title,
            description: updatedData.description,
            deadline: updatedData.deadline,
            // Preserve these critical display fields
            status: existingProject.status,
            estimated_time: existingProject.estimated_time,
            estimatedHours: existingProject.estimatedHours,
            completedTasks: existingProject.completedTasks || 0,
            totalTasks: existingProject.totalTasks || 0,
        };
        setLocalProjectUpdates((prev) => ({
            ...prev,
            [projectId]: updatedLocalProject,
        }));

        // Format the data as expected by the API, preserving existing values
        const projectData = {
            name: updatedData.title,
            description: updatedData.description,
            deadline: updatedData.deadline,
            // Preserve these critical fields
            estimated_time: existingProject.estimated_time,
            status: existingProject.status,
            priority: existingProject.priority || "medium",
            detail_depth: existingProject.detail_depth || "normal",
        };

        dispatch(
            updateProject({
                projectId,
                projectData,
            })
        ).then((action) => {
            // If the update was successful
            if (action.meta.requestStatus === "fulfilled") {
                if (action.payload) {
                    const payload = action.payload as any;
                    // Create a merged object with updated values from the response
                    const updatedProject: Partial<ProjectData> = {
                        id: projectId,
                        name: payload.name || updatedData.title,
                        title: payload.name || updatedData.title,
                        description: payload.description,
                        deadline: payload.deadline,
                        completedTasks:
                            payload.completedTasks ||
                            existingProject.completedTasks ||
                            0,
                        totalTasks:
                            payload.totalTasks ||
                            existingProject.totalTasks ||
                            0,
                        estimated_time: payload.estimated_time,
                        status: payload.status,
                        updated_at: payload.updated_at, // Include updated timestamp
                    };

                    // Both update filtered projects and the main projects array
                    const updateProject = (project: ProjectData) => {
                        if (String(project.id) === projectId) {
                            return { ...project, ...updatedProject };
                        }
                        return project;
                    };

                    setFilteredProjects((prev) => prev.map(updateProject));

                    // This is necessary to update the main projects array and ensure consistency
                    // without causing a full page refresh
                    const updatedProjects = projects.map(updateProject);
                    (projects as any).length = 0;
                    (projects as any).push(...updatedProjects);

                    // Clear local updates for this project
                    setLocalProjectUpdates((prev) => {
                        const newUpdates = { ...prev };
                        delete newUpdates[projectId];
                        return newUpdates;
                    });
                }
            }
            setUpdatingProjectId(null);
        });
    };

    const handleDeleteProject = (projectId: string) => {
        if (!user?.id) return;

        setUpdatingProjectId(projectId);

        dispatch(deleteProject(projectId)).then((action) => {
            if (action.meta.requestStatus === "fulfilled") {
                // Update local state immediately for a responsive UI
                setFilteredProjects((prev) =>
                    prev.filter((project) => String(project.id) !== projectId)
                );

                // Also update the main projects array without causing a refresh
                const updatedProjects = projects.filter(
                    (project) => String(project.id) !== projectId
                );
                (projects as any).length = 0;
                (projects as any).push(...updatedProjects);
            }
            setUpdatingProjectId(null);
        });
    };

    const applyFilters = (
        search: string,
        filter: string,
        sort: string,
        projectsToFilter: ProjectData[] = projects
    ) => {
        let result = [...projectsToFilter];

        if (search) {
            result = result.filter((project) => {
                const title = project.title || project.name || "";
                const description = project.description || "";
                return (
                    title.toLowerCase().includes(search.toLowerCase()) ||
                    description.toLowerCase().includes(search.toLowerCase())
                );
            });
        }

        if (filter !== "All") {
            const statusMap: { [key: string]: string } = {
                Active: "in_progress",
                Completed: "completed",
                Planning: "planning",
                Delayed: "delayed",
            };

            if (statusMap[filter]) {
                result = result.filter(
                    (project) => project.status === statusMap[filter]
                );
            }
        }

        // Apply sorting
        switch (sort) {
            case "Name A-Z":
                result.sort((a, b) => {
                    const titleA = a.title || a.name || "";
                    const titleB = b.title || b.name || "";
                    return titleA.localeCompare(titleB);
                });
                break;
            case "Name Z-A":
                result.sort((a, b) => {
                    const titleA = a.title || a.name || "";
                    const titleB = b.title || b.name || "";
                    return titleB.localeCompare(titleA);
                });
                break;
            case "Oldest First":
                result.sort((a, b) => {
                    const dateA = a.created_at
                        ? new Date(a.created_at).getTime()
                        : 0;
                    const dateB = b.created_at
                        ? new Date(b.created_at).getTime()
                        : 0;
                    return dateA - dateB;
                });
                break;
            case "Newest First":
                result.sort((a, b) => {
                    const dateA = a.created_at
                        ? new Date(a.created_at).getTime()
                        : 0;
                    const dateB = b.created_at
                        ? new Date(b.created_at).getTime()
                        : 0;
                    return dateB - dateA;
                });
                break;
            case "Last Updated":
                result.sort((a, b) => {
                    const dateA = a.updated_at
                        ? new Date(a.updated_at).getTime()
                        : 0;
                    const dateB = b.updated_at
                        ? new Date(b.updated_at).getTime()
                        : 0;
                    return dateB - dateA;
                });
                break;
            default:
                // Keep original order
                break;
        }

        setFilteredProjects(result);
    };

    const handleNewProject = () => {
        navigate("/projects/new");
    };

    const handleViewProjectDetails = (projectId: string) => {
        navigate(`/dashboard/projects/${projectId}`);
    };

    // Helper function to map backend status to UI status
    const mapStatusToUI = (status: string): ProjectStatus => {
        const statusMap: { [key: string]: ProjectStatus } = {
            planning: "planning",
            in_progress: "in-progress",
            delayed: "delayed",
            completed: "completed",
        };
        return statusMap[status] || "planning";
    };

    // Apply any local updates for immediate UI responsiveness
    const getDisplayProject = (project: ProjectData) => {
        const localUpdate = localProjectUpdates[String(project.id)];
        if (localUpdate) {
            return { ...project, ...localUpdate };
        }
        return project;
    };

    if (isLoading && !updatingProjectId) {
        return (
            <div className="loading-container">
                <CircularProgress />
                <p>Loading projects...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error loading projects: {error}</p>
                <button
                    className="retry-button"
                    onClick={() => {
                        if (user?.id) {
                            // @ts-ignore: Dispatch type inference issue
                            dispatch(fetchProjects(parseInt(user.id)));
                        }
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="projects-page">
            <ProjectFilters
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                onNewProject={handleNewProject}
            />

            <div className="projects-list">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => {
                        const isUpdating =
                            updatingProjectId === String(project.id);
                        const displayProject = getDisplayProject(project);

                        return (
                            <ProjectCard
                                key={project.id}
                                id={String(project.id)}
                                title={
                                    displayProject.name ||
                                    displayProject.title ||
                                    "Unnamed Project"
                                }
                                description={displayProject.description || ""}
                                status={mapStatusToUI(displayProject.status)}
                                estimatedHours={`${displayProject.estimated_time}h`}
                                tasksCompleted={
                                    displayProject.completedTasks || 0
                                }
                                totalTasks={displayProject.totalTasks || 0}
                                deadline={displayProject.deadline}
                                lastUpdatedDate={formatDateForDisplay(
                                    displayProject.updated_at
                                )}
                                lastUpdatedTime={formatTimeForDisplay(
                                    displayProject.updated_at
                                )}
                                onViewDetails={handleViewProjectDetails}
                                onUpdateProject={handleUpdateProject}
                                onDeleteProject={handleDeleteProject}
                            />
                        );
                    })
                ) : (
                    <div className="no-projects">
                        {projects.length > 0 ? (
                            <>
                                <p>No projects match your filters.</p>
                                <button
                                    className="reset-filters-btn"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setActiveFilter("All");
                                        setSortBy("Last Updated");
                                        setFilteredProjects(projects);
                                    }}
                                >
                                    Reset Filters
                                </button>
                            </>
                        ) : (
                            <>
                                <p>You don't have any projects yet.</p>
                                <button
                                    className="create-project-btn"
                                    onClick={handleNewProject}
                                >
                                    Create Your First Project
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const formatDateForDisplay = (dateString?: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
        return "Today";
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatTimeForDisplay = (dateString?: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export default Projects;
