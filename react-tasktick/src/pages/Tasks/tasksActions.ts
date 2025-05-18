import { AppDispatch } from "../../store";
import {
    fetchTasks,
    updateTaskCell,
} from "../../store/slices/tasksSlice";
import { fetchActiveSession } from "../../store/slices/timeTrackingsSlice";

export const loadTasksData = (userId: number, dispatch: AppDispatch) => {
    dispatch(fetchTasks("all" as any));
    dispatch(fetchActiveSession(userId));
};

export const updateTaskValue = (
    projectId: number,
    taskId: string | number,
    field: string,
    value: any,
    dispatch: AppDispatch
) => {
    dispatch(
        updateTaskCell({
            projectId,
            taskId,
            field,
            value,
        })
    );
}; 