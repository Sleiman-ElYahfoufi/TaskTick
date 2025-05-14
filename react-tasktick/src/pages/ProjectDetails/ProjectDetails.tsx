import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    fetchProjectById,
    selectSelectedProject,
    selectProjectsLoading,
    selectProjectsError,
} from "../../store/slices/projectsSlice";
import {
    fetchTasks,
    selectAllTasks,
    selectTasksLoading,
    selectTasksError,
    selectLoadingTaskIds,
    selectCellUpdateErrors,
} from "../../store/slices/tasksSlice";
import ProjectOverviewCard from "../../components/ProjectDetailsComponents/ProjectOverviewCard/ProjectOverviewCard";
import CurrentTask from "../../components/SharedComponents/CurrentTask/CurrentTask";
import TasksTable from "../../components/SharedComponents/TasksTable/TasksTable";
import "./ProjectDetails.css";

// Import custom hooks and utilities
import useTaskActionsHandler from "../../components/ProjectDetailsComponents/TaskActionsHandler/TaskActionsHandler";
import useTaskCellHandlers from "../../components/ProjectDetailsComponents/TaskCellHandlers/TaskCellHandlers";
import useTaskColumns from "../../components/ProjectDetailsComponents/TaskColumns/TaskColumns";
import useTaskDataMapper from "../../components/ProjectDetailsComponents/TaskDataMapper/TaskDataMapper";
import useProjectStats from "../../components/ProjectDetailsComponents/ProjectStats/ProjectStats";

const ProjectDetails: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Get project and tasks from Redux state
    const project = useAppSelector(selectSelectedProject);
    const projectTasks = useAppSelector(selectAllTasks);
    const isProjectLoading = useAppSelector(selectProjectsLoading);
    const isTasksLoading = useAppSelector(selectTasksLoading);
    const projectError = useAppSelector(selectProjectsError);
    const tasksError = useAppSelector(selectTasksError);
    const loadingTaskIds = useAppSelector(selectLoadingTaskIds);
    const cellErrors = useAppSelector(selectCellUpdateErrors);

    // Derived state
    const isLoading = isProjectLoading || isTasksLoading;
    const error = projectError || tasksError;

    // Use custom hooks to organize functionality
    const { tasks, currentTask } = useTaskDataMapper({ projectTasks });
    const { handleAddTask, handleDeleteTask, handleStartTimer } =
        useTaskActionsHandler({
            projectId: projectId || "",
        });
    const { handleCellValueChange, handleTaskUpdate } = useTaskCellHandlers({
        projectId: projectId || "",
    });
    const columns = useTaskColumns({ handleStartTimer, handleDeleteTask });
    const projectUIProps = useProjectStats({ project, tasks });

    // Define which fields can be edited directly
    const editableFields = [
        "name",
        "estimatedTime",
        "dueDate",
        "description",
        "priority",
        "progress",
        "status",
    ];

    useEffect(() => {
        if (!projectId) {
            return;
        }

        // Fetch project details and tasks
        dispatch(fetchProjectById(projectId));
        dispatch(fetchTasks(projectId));
    }, [projectId, dispatch]);

    if (isLoading) {
        return (
            <div className="project-details-page">
                <div className="project-details-header">
                    <h1>Projects</h1>
                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard/projects")}
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
                        onClick={() => navigate("/dashboard/projects")}
                    >
                        Back to Projects
                    </button>
                </div>
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button
                        className="retry-button"
                        onClick={() => {
                            if (projectId) {
                                dispatch(fetchProjectById(projectId));
                                dispatch(fetchTasks(projectId));
                            }
                        }}
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
                        onClick={() => navigate("/dashboard/projects")}
                    >
                        Back to Projects
                    </button>
                </div>
                <div className="error-container">
                    <p className="error-message">Project not found.</p>
                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard/projects")}
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="project-details-page">
            <div className="project-details-header">
                <h1>Projects</h1>
                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard/projects")}
                >
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
                    {currentTask ? (
                        <CurrentTask
                            taskName={currentTask.name}
                            category={currentTask.category || "Task"}
                            estimatedTime={currentTask.estimatedTime || "0 hrs"}
                            progress={currentTask.progress || 0}
                            elapsedTime={currentTask.elapsedTime || "00:00:00"}
                            sessions={4}
                            totalTime="2h 15m total"
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
                        onTaskUpdate={(updatedTask: any) =>
                            handleTaskUpdate(updatedTask)
                        }
                        onCellValueChange={handleCellValueChange}
                        loadingTaskIds={loadingTaskIds}
                        editableFields={editableFields}
                    />
                ) : (
                    <div className="no-tasks-message">
                        <p>No tasks found for this project.</p>
                        <button
                            className="add-task-button"
                            onClick={handleAddTask}
                        >
                            Add Your First Task
                        </button>
                    </div>
                )}

                {/* Display cell update errors if needed */}
                {Object.keys(cellErrors).length > 0 && (
                    <div className="cell-errors">
                        <h4>Update Errors</h4>
                        <ul>
                            {Object.entries(cellErrors).map(
                                ([key, errorMsg]) => (
                                    <li key={key}>{errorMsg}</li>
                                )
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
