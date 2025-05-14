import { useCallback } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { addTask, deleteTask } from "../../../store/slices/tasksSlice";
import { ProjectTask } from "../../../services/projectsService";

interface TaskActionsHandlerProps {
    projectId: string;
}

export const useTaskActionsHandler = ({
});

export default useTaskActionsHandler;
