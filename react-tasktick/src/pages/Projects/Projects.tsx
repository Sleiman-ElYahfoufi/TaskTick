import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard, {
    ProjectStatus,
} from "../../components/ProjectsComponents/ProjectCard/ProjectCard";
import ProjectFilters from "../../components/ProjectsComponents/ProjectFilters/ProjectFilters";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { fetchProjects } from "../../store/slices/projectsSlice";
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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.auth);
    const { projects, isLoading, error } = useSelector(
        (state: RootState) => state.projects
    );

    const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Last Updated");

    useEffect(() => {
        // Only fetch projects if user is authenticated
        if (user?.id) {
            // @ts-ignore: Dispatch type inference issue
            dispatch(fetchProjects(parseInt(user.id)));
        }
    }, [dispatch, user]);

    // Update filtered projects whenever projects array changes
    useEffect(() => {
        if (projects && projects.length > 0) {
            applyFilters(searchTerm, activeFilter, sortBy);
        } else {
            setFilteredProjects([]);
        }
    }, [projects]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        applyFilters(term, activeFilter, sortBy);
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        applyFilters(searchTerm, filter, sortBy);
    };

    const handleSortChange = (sort: string) => {
        setSortBy(sort);
        applyFilters(searchTerm, activeFilter, sort);
    };

    const applyFilters = (search: string, filter: string, sort: string) => {
        let result = [...projects];

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

    if (isLoading) {
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
                        return (
                            <ProjectCard
                                key={project.id}
                                id={String(project.id)}
                                title={project.name || "Unnamed Project"}
                                description={project.description || ""}
                                status={mapStatusToUI(project.status)}
                                estimatedHours={`${project.estimated_time}h`}
                                tasksCompleted={project.completedTasks || 0}
                                totalTasks={project.totalTasks || 0}
                                deadline={project.deadline}
                                lastUpdatedDate={formatDateForDisplay(
                                    project.updated_at
                                )}
                                lastUpdatedTime={formatTimeForDisplay(
                                    project.updated_at
                                )}
                                onViewDetails={handleViewProjectDetails}
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
