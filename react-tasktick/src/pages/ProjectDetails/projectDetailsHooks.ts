import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    selectSelectedProject,
    selectProjectsLoading,
    selectProjectsError,
} from '../../store/slices/projectsSlice';
import {
    selectAllTasks,
    selectTasksLoading,
    selectTasksError,
    selectLoadingTaskIds,
    selectCellUpdateErrors,
} from '../../store/slices/tasksSlice';
import {
    selectActiveSession,
} from '../../store/slices/timeTrackingsSlice';

import useTaskActionsHandler from '../../components/ProjectDetailsComponents/TaskActionsHandler/TaskActionsHandler';
import useTaskCellHandlers from '../../components/ProjectDetailsComponents/TaskCellHandlers/TaskCellHandlers';
import useTaskColumns from '../../components/ProjectDetailsComponents/TaskColumns/TaskColumns';
import useTaskDataMapper from '../../components/ProjectDetailsComponents/TaskDataMapper/TaskDataMapper';
import useProjectStats from '../../components/ProjectDetailsComponents/ProjectStats/ProjectStats';

import { loadProjectDetails, loadTaskTimeDetails } from './projectDetailsActions';
import { TaskDetails, getSelectedTask, EDITABLE_FIELDS } from './projectDetailsFunctions';

export const useProjectDetailsData = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

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

    useEffect(() => {
        loadProjectDetails(projectId, user?.id, dispatch);
    }, [projectId, dispatch, user]);

    return {
        projectId,
        project,
        projectTasks,
        isLoading,
        error,
        loadingTaskIds,
        cellErrors,
        activeSession,
        user,
        dispatch
    };
};

export const useTaskSelection = () => {
    const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null);
    const [selectedTaskDetails, setSelectedTaskDetails] = useState<TaskDetails>({
        sessions: 0,
        totalTime: "0h 0m",
    });

    return {
        selectedTaskId,
        setSelectedTaskId,
        selectedTaskDetails,
        setSelectedTaskDetails
    };
};

export const useProjectDetailsHandlers = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { selectedTaskId, setSelectedTaskId, selectedTaskDetails, setSelectedTaskDetails } = useTaskSelection();
    const { tasks, currentTask } = useTaskDataMapper({ projectTasks: useAppSelector(selectAllTasks) });
    const { handleAddTask, handleDeleteTask, handleStartTimer, DeleteTaskModal } = useTaskActionsHandler({
        projectId: projectId || "",
    });
    const { handleCellValueChange, handleTaskUpdate } = useTaskCellHandlers({
        projectId: projectId || "",
    });

    const handleTimeClick = async (taskId: string | number) => {
        console.log(`[ProjectDetails] handleTimeClick - Task ${taskId} time clicked`);
        setSelectedTaskId(taskId);
        await loadTaskTimeDetails(taskId, dispatch, setSelectedTaskDetails);
    };

    const columns = useTaskColumns({
        handleStartTimer,
        handleDeleteTask,
        onTimeClick: handleTimeClick,
    });

    const project = useAppSelector(selectSelectedProject);
    const projectUIProps = useProjectStats({ project, tasks });

    const activeSession = useAppSelector(selectActiveSession);
    useEffect(() => {
        if (activeSession) {
            console.log(`[ProjectDetails] Active session detected for task ${activeSession.task_id}`);
            setSelectedTaskId(activeSession.task_id);
            handleTimeClick(activeSession.task_id);
        }
    }, [activeSession]);

    const selectedTask = getSelectedTask(tasks, selectedTaskId, currentTask);

    return {
        handleAddTask,
        handleDeleteTask,
        handleStartTimer,
        handleTimeClick,
        handleTaskUpdate,
        handleCellValueChange,
        DeleteTaskModal,
        navigateToProjects: () => navigate("/dashboard/projects"),
        columns,
        tasks,
        currentTask,
        selectedTask,
        selectedTaskDetails,
        projectUIProps,
        editableFields: EDITABLE_FIELDS
    };
};

export const useProjectDetails = () => {
    const data = useProjectDetailsData();
    const handlers = useProjectDetailsHandlers();

    return {
        ...data,
        ...handlers
    };
}; 