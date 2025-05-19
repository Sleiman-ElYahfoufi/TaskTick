import React from "react";
import ProjectOverviewCard from "../../components/ProjectDetailsComponents/ProjectOverviewCard/ProjectOverviewCard";
import CurrentTask from "../../components/SharedComponents/CurrentTask/CurrentTask";
import TasksTable from "../../components/SharedComponents/TasksTable/TasksTable";
import "./ProjectDetails.css";

import { useProjectDetails } from "./projectDetailsHooks";
import { retryLoadingProject } from "./projectDetailsActions";

const ProjectDetails: React.FC = () => {
    const {
        projectId,
        project,
        isLoading,
        error,
        dispatch,
        loadingTaskIds,
        cellErrors,

        handleAddTask,
        handleDeleteTask,
        handleStartTimer,
        handleTaskUpdate,
        handleCellValueChange,
        DeleteTaskModal,
        navigateToProjects,
        columns,
        tasks,
        selectedTask,
        selectedTaskDetails,
        projectUIProps,
        editableFields,
    } = useProjectDetails();

    if (isLoading) {
        return (
            <div className="project-details-page">
                <div className="project-details-header">
                    <h1>Projects</h1>
                    <button
                        className="back-button"
                        onClick={navigateToProjects}
                    >
                        Back to Projects
                    </button>
                </div>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading project details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-details-page">
                <div className="project-details-header">
                    <h1>Projects</h1>
                    <button
                        className="back-button"
                        onClick={navigateToProjects}
                    >
                        Back to Projects
                    </button>
                </div>
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button
                        className="retry-button"
                        onClick={() => retryLoadingProject(projectId, dispatch)}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-details-page">
                <div className="project-details-header">
                    <h1>Projects</h1>
                    <button
                        className="back-button"
                        onClick={navigateToProjects}
                    >
                        Back to Projects
                    </button>
                </div>
                <div className="error-container">
                    <p className="error-message">Project not found.</p>
                    <button
                        className="back-button"
                        onClick={navigateToProjects}
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="project-details-page">
            {/* Delete Task Modal */}
            {DeleteTaskModal}

            <div className="project-details-header">
                <h1>Projects</h1>
                <button className="back-button" onClick={navigateToProjects}>
                    Back to Projects
                </button>
            </div>

            <div className="project-details-content">
                <ProjectOverviewCard
                    name={projectUIProps.name}
                    completedTasks={projectUIProps.completedTasks}
                    totalTasks={projectUIProps.totalTasks}
                    timeSpent={projectUIProps.timeSpent}
                    totalEstimatedTime={projectUIProps.totalEstimatedTime}
                />

                <div className="tasks-header">
                    {selectedTask ? (
                        <CurrentTask
                            taskId={selectedTask.id}
                            taskName={selectedTask.name}
                            category={selectedTask.priority || "Task"}
                            estimatedTime={
                                selectedTask.estimatedTime || "0 hrs"
                            }
                            progress={selectedTask.progress || 0}
                            elapsedTime={selectedTask.elapsedTime || "00:00:00"}
                            sessions={selectedTaskDetails.sessions}
                            totalTime={selectedTaskDetails.totalTime}
                            projectId={projectId}
                        />
                    ) : (
                        <div className="no-current-task">
                            <p>No active task.</p>
                        </div>
                    )}

                    <button className="add-task-button" onClick={handleAddTask}>
                        Add Task
                    </button>
                </div>

                {tasks.length > 0 ? (
                    <TasksTable
                        key="tasks-table"
                        tasks={tasks}
                        columns={columns}
                        onStartTimer={handleStartTimer}
                        onDeleteTask={handleDeleteTask}
                        onTaskUpdate={handleTaskUpdate}
                        onCellValueChange={handleCellValueChange}
                        editableFields={editableFields}
                        loadingTaskIds={loadingTaskIds}
                        cellErrors={cellErrors}
                    />
                ) : (
                    <div className="no-tasks-message">
                        <p>
                            No tasks found for this project. Add a task to get
                            started.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
