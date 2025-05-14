import { useCallback, useRef } from "react";
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
    const processingUpdatesRef = useRef<{ [key: string]: boolean }>({});

    const handleCellValueChange = useCallback(
        (taskId: string | number, field: string, value: any) => {
            if (!projectId) return;

            const updateKey = `${taskId}_${field}`;

            if (processingUpdatesRef.current[updateKey]) {
                return;
            }

            processingUpdatesRef.current[updateKey] = true;

            const finishUpdate = () => {
                setTimeout(() => {
                    processingUpdatesRef.current[updateKey] = false;
                }, 300); 
            };

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
                    ).finally(finishUpdate);
                } else {
                    finishUpdate();
                }
                return;
            }

            if (field === "estimatedTime") {
                const numericValue = processEstimatedTime(value);
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

                dispatch(
                    updateTaskCell({
                        projectId,
                        taskId,
                        field: "estimated_time",
                        value: numericValue,
                    })
                ).finally(finishUpdate);

                return;
            }

            dispatch(optimisticUpdateCell({ taskId, field, value }));
            dispatch(
                updateTaskCell({ projectId, taskId, field, value })
            ).finally(finishUpdate);
        },
        [projectId, dispatch]
    );

    const handleTaskUpdate = useCallback(
        (updatedTask: any) => {
            if (!projectId) return;

            const taskId = updatedTask.id;

            const { id, category, elapsedTime, ...taskFieldsToUpdate } =
                updatedTask;

            if (taskFieldsToUpdate.dueDate) {
                const processedDate = processDateValue(
                    taskFieldsToUpdate.dueDate
                );
                if (processedDate !== null) {
                    taskFieldsToUpdate.dueDate = processedDate;
                }
            }

            if (taskFieldsToUpdate.estimatedTime) {
                const numericValue = processEstimatedTime(
                    taskFieldsToUpdate.estimatedTime
                );
                taskFieldsToUpdate.estimated_time = numericValue;
                taskFieldsToUpdate.estimatedTime =
                    getEstimatedTimeDisplay(numericValue);
            }

            dispatch(
                optimisticUpdateTask({
                    id,
                    ...taskFieldsToUpdate,
                })
            );

            dispatch(
                updateTask({
                    projectId,
                    taskId,
                    taskData: taskFieldsToUpdate,
                })
            );
        },
        [projectId, dispatch]
    );

    return {
        handleCellValueChange,
        handleTaskUpdate,
    };
};

export default useTaskCellHandlers;
