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
    const dispatch = useAppDispatch();

    const handleCellValueChange = useCallback(
        (taskId: string | number, field: string, value: any) => {
            if (!projectId) return;

            if (field === "dueDate") {
                const processedDate = processDateValue(value);

                if (processedDate !== null) {
                    dispatch(
                        optimisticUpdateCell({
                            taskId,
                            field,
                            value: processedDate,
                        })
                    );
                    dispatch(
                        updateTaskCell({
                            projectId,
                            taskId,
                            field,
                            value: processedDate,
                        })
                    );
                }
                return;
            }

            if (field === "estimatedTime") {
                const numericValue = processEstimatedTime(value);

                dispatch(
                    updateTaskCell({
                        projectId,
                        taskId,
                        field: "estimated_time",
                        value: numericValue,
                    })
                );

                const displayValue = getEstimatedTimeDisplay(numericValue);
                dispatch(
                    optimisticUpdateCell({
                        taskId,
                        field: "estimatedTime",
                        value: displayValue,
                    })
                );

                dispatch(
                    optimisticUpdateCell({
                        taskId,
                        field: "estimated_time",
                        value: numericValue,
                    })
                );

                return;
            }

            dispatch(optimisticUpdateCell({ taskId, field, value }));
            dispatch(updateTaskCell({ projectId, taskId, field, value }));
        },
        [projectId, dispatch]
    );



    return {
        handleCellValueChange,
        
    };
};

export default useTaskCellHandlers;
