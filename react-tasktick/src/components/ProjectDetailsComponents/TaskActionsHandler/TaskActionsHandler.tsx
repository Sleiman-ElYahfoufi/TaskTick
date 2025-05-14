import { useCallback } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { addTask, deleteTask } from "../../../store/slices/tasksSlice";
import { ProjectTask } from "../../../services/projectsService";

interface TaskActionsHandlerProps {
    projectId: string;
}

export const useTaskActionsHandler = ({
    projectId,
}: TaskActionsHandlerProps) => {
    const dispatch = useAppDispatch();

    const handleAddTask = useCallback(() => {
        if (!projectId) return;

        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const formattedDate = nextWeek.toISOString().split("T")[0];

        const newTask: Partial<ProjectTask> = {
            name: "New Task",
            description: "Add task description here",
            estimated_time: 1,
            estimatedTime: "1 hrs",
            dueDate: formattedDate,
            priority: "Medium",
            progress: 0,
            status: "Not Started",
        };

        dispatch(addTask({ projectId, task: newTask }));
    }, [projectId, dispatch]);

    const handleDeleteTask = useCallback(
        (taskId: string | number) => {
            if (!projectId) return;
            dispatch(deleteTask({ projectId, taskId }));
        },
        [projectId, dispatch]
    );



    return {
        handleAddTask,
        handleDeleteTask,
 
    };
};

export default useTaskActionsHandler;
