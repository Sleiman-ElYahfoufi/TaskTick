import { AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";
import { fetchProjectById } from "../../store/slices/projectsSlice";
import { fetchTasks } from "../../store/slices/tasksSlice";
import {
    fetchActiveSession,
    fetchTaskTimeSummary,
    fetchTaskTimeTrackings
} from "../../store/slices/timeTrackingsSlice";
import timeTrackingService from "../../services/timeTrackingService";
import { TaskDetails } from "./projectDetailsFunctions";


export const loadProjectDetails = (
    projectId: string | undefined,
    userId: string | undefined,
    dispatch: AppDispatch
): void => {
    if (!projectId) {
        return;
    }

    dispatch(fetchProjectById(projectId));
    dispatch(fetchTasks(projectId));

    if (userId) {
        dispatch(fetchActiveSession(Number(userId)));
    }
};

export const retryLoadingProject = (
    projectId: string | undefined,
    dispatch: AppDispatch
): void => {
    if (projectId) {
        dispatch(fetchProjectById(projectId));
        dispatch(fetchTasks(projectId));
    }
};

export const loadTaskTimeDetails = async (
    taskId: string | number,
    dispatch: AppDispatch,
    setSelectedTaskDetails: (details: TaskDetails) => void
): Promise<void> => {
    try {
        console.log(`[ProjectDetails] handleTimeClick - Fetching summary for task ${taskId}`);
        const summary = await timeTrackingService.getTaskTimeSummary(Number(taskId));

        console.log(`[ProjectDetails] handleTimeClick - Fetching time trackings for task ${taskId}`);
        await timeTrackingService.getTimeTrackingsByTaskId(Number(taskId));

        console.log(`[ProjectDetails] handleTimeClick - Summary received:`, summary);
        setSelectedTaskDetails({
            sessions: summary.session_count || 0,
            totalTime: timeTrackingService.formatTime(summary.total_duration_hours || 0),
        });

        dispatch(fetchTaskTimeSummary(Number(taskId)));
        dispatch(fetchTaskTimeTrackings(Number(taskId)));
    } catch (error) {
        console.error("[ProjectDetails] handleTimeClick - Error fetching time tracking data:", error);
    }
};

export const navigateToProjects = (navigate: ReturnType<typeof useNavigate>): void => {
    navigate("/dashboard/projects");
}; 