import React, { useEffect, useState } from "react";
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
import {
    fetchActiveSession,
    fetchTaskTimeSummary,
    fetchTaskTimeTrackings,
    selectActiveSession,
} from "../../store/slices/timeTrackingsSlice";
import ProjectOverviewCard from "../../components/ProjectDetailsComponents/ProjectOverviewCard/ProjectOverviewCard";
import CurrentTask from "../../components/SharedComponents/CurrentTask/CurrentTask";
import TasksTable from "../../components/SharedComponents/TasksTable/TasksTable";
import "./ProjectDetails.css";

import useTaskActionsHandler from "../../components/ProjectDetailsComponents/TaskActionsHandler/TaskActionsHandler";
import useTaskCellHandlers from "../../components/ProjectDetailsComponents/TaskCellHandlers/TaskCellHandlers";
import useTaskColumns from "../../components/ProjectDetailsComponents/TaskColumns/TaskColumns";
import useTaskDataMapper from "../../components/ProjectDetailsComponents/TaskDataMapper/TaskDataMapper";
import useProjectStats from "../../components/ProjectDetailsComponents/ProjectStats/ProjectStats";
import timeTrackingService from "../../services/timeTrackingService";

const ProjectDetails: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const [selectedTaskId, setSelectedTaskId] = useState<
        string | number | null
    >(null);
    const [selectedTaskDetails, setSelectedTaskDetails] = useState({
        sessions: 0,
        totalTime: "0h 0m",
    });

    const project = useAppSelector(selectSelectedProject);
    const projectTasks = useAppSelector(selectAllTasks);
    const isProjectLoading = useAppSelector(selectProjectsLoading);
    const isTasksLoading = useAppSelector(selectTasksLoading);
    const projectError = useAppSelector(selectProjectsError);
    const tasksError = useAppSelector(selectTasksError);
    const loadingTaskIds = useAppSelector(selectLoadingTaskIds);
    const cellErrors = useAppSelector(selectCellUpdateErrors);
    const activeSession = useAppSelector(selectActiveSession);

    const isLoading = isProjectLoading || isTasksLoading;
    const error = projectError || tasksError;

    const { tasks, currentTask } = useTaskDataMapper({ projectTasks });
    const {
        handleAddTask,
        handleDeleteTask,
        handleStartTimer,
        DeleteTaskModal,
    } = useTaskActionsHandler({
        projectId: projectId || "",
    });
    const { handleCellValueChange, handleTaskUpdate } = useTaskCellHandlers({
        projectId: projectId || "",
    });

    const handleTimeClick = async (taskId: string | number) => {
        console.log(
            `[ProjectDetails] handleTimeClick - Task ${taskId} time clicked`
        );
        setSelectedTaskId(taskId);

        try {
            console.log(
                `[ProjectDetails] handleTimeClick - Fetching summary for task ${taskId}`
            );
            const summary = await timeTrackingService.getTaskTimeSummary(
                Number(taskId)
            );

            console.log(
                `[ProjectDetails] handleTimeClick - Fetching time trackings for task ${taskId}`
            );
            await timeTrackingService.getTimeTrackingsByTaskId(Number(taskId));

            console.log(
                `[ProjectDetails] handleTimeClick - Summary received:`,
                summary
            );
            setSelectedTaskDetails({
                sessions: summary.session_count || 0,
                totalTime: timeTrackingService.formatTime(
                    summary.total_duration_hours || 0
                ),
            });

            dispatch(fetchTaskTimeSummary(Number(taskId)));
            dispatch(fetchTaskTimeTrackings(Number(taskId)));
        } catch (error) {
            console.error(
                "[ProjectDetails] handleTimeClick - Error fetching time tracking data:",
                error
            );
        }
    };

    const columns = useTaskColumns({
        handleStartTimer,
        handleDeleteTask,
        onTimeClick: handleTimeClick,
    });

    const projectUIProps = useProjectStats({ project, tasks });

    const editableFields = [
        "name",
        "estimatedTime",
        "dueDate",
        "description",
        "priority",
        "progress",
    ];

    useEffect(() => {
        if (!projectId) {
            return;
        }

        dispatch(fetchProjectById(projectId));
        dispatch(fetchTasks(projectId));

        if (user?.id) {
            dispatch(fetchActiveSession(Number(user.id)));
        }
    }, [projectId, dispatch, user]);

    useEffect(() => {
        if (activeSession) {
            console.log(
                `[ProjectDetails] Active session detected for task ${activeSession.task_id}`
            );
            setSelectedTaskId(activeSession.task_id);
            handleTimeClick(activeSession.task_id);
        }
    }, [activeSession]);

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

    const selectedTask = selectedTaskId
        ? tasks.find((task) => String(task.id) === String(selectedTaskId)) ||
          currentTask
        : currentTask;

    return (
        <div className="project-details-page">
            {/* Delete Task Modal */}
            {DeleteTaskModal}

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
                    <div className="responsive-table-container">
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
                            editableFields={editableFields}
                            loadingTaskIds={loadingTaskIds}
                            cellErrors={cellErrors}
                        />
                    </div>
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
