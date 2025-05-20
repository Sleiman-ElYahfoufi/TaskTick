import React from "react";
import ProjectCard from "../../components/ProjectsComponents/ProjectCard/ProjectCard";
import ProjectFilters from "../../components/ProjectsComponents/ProjectFilters/ProjectFilters";
import "./Projects.css";

import CircularProgress from "@mui/material/CircularProgress";

import {
    formatDateForDisplay,
    formatTimeForDisplay,
    mapStatusToUI,
    getDisplayProject,
} from "./projectFunctions";

import {
    useProjectData,
    useProjectFilters,
    useProjectOperations,
} from "./projectHooks";

const Projects: React.FC = () => {
    const { projects, isLoading, error, user, retryFetch } = useProjectData();

    const {
        filteredProjects,
        setFilteredProjects,
        localProjectUpdates,
        setLocalProjectUpdates,
        handleSearch,
        handleFilterChange,
        handleSortChange,
        resetFilters,
    } = useProjectFilters(projects);

    const {
        updateProject,
        deleteProject,
        viewProjectDetails,
        createNewProject,
        updatingProjectId,
    } = useProjectOperations();

    const onUpdateProject = (
        projectId: string,
        updatedData: {
            title: string;
            description: string;
            deadline?: string | null;
        }
    ) => {
        if (!user?.id) return;

        const existingProject = projects.find(
            (p) => String(p.id) === projectId
        );
        const localUpdate = localProjectUpdates[projectId];

        if (!existingProject) {
            console.error("Project not found for updating");
            return;
        }

        const currentStatus = localUpdate?.status || existingProject.status;

        updateProject(
            projectId,
            updatedData,
            existingProject,
            currentStatus,
            setLocalProjectUpdates,
            setFilteredProjects
        );
    };

    const onDeleteProject = (projectId: string) => {
        deleteProject(projectId, setFilteredProjects);
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
                <button className="retry-button" onClick={retryFetch}>
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
                onNewProject={createNewProject}
            />

            <div className="projects-list">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => {
                        const displayProject = getDisplayProject(
                            project,
                            localProjectUpdates
                        );

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
                                onViewDetails={viewProjectDetails}
                                onUpdateProject={onUpdateProject}
                                onDeleteProject={onDeleteProject}
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
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </button>
                            </>
                        ) : (
                            <>
                                <p>You don't have any projects yet.</p>
                                <button
                                    className="create-project-btn"
                                    onClick={createNewProject}
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

export default Projects;
