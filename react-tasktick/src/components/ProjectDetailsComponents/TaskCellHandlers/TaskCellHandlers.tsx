import { useCallback } from "react";
import { useAppDispatch } from "../../../store/hooks";
import {
    updateTaskCell,
    optimisticUpdateCell,
    optimisticUpdateTask,
    updateTask,
} from "../../../store/slices/tasksSlice";
import {
    processDateValue,
    processEstimatedTime,
    getEstimatedTimeDisplay,
} from "../../../utils/TaskFormattingUtils";

interface TaskCellHandlersProps {
    projectId: string;
}

export const useTaskCellHandlers = ({ projectId }: TaskCellHandlersProps) => {

    return {
     
    };
};

export default useTaskCellHandlers;
