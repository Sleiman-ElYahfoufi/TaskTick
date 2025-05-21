import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
    addTask,
    deleteTask,
    updateTask,
    selectAllTasks,
} from "../../../store/slices/tasksSlice";
import { ProjectTask } from "../../../services/projectsService";
import {
    startTaskSession,
    fetchTaskTimeSummary,
    fetchTaskTimeTrackings,
    fetchActiveSession,
    selectActiveSession,
} from "../../../store/slices/timeTrackingsSlice";
import { RootState } from "../../../store";
import DeleteModal from "../../SharedComponents/DeleteModal/DeleteModal";

interface TaskActionsHandlerProps {
    projectId: string;
}

export const useTaskActionsHandler = ({
    projectId,
}: TaskActionsHandlerProps) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state: RootState) => state.auth);
    const tasks = useAppSelector(selectAllTasks);
    const activeSession = useAppSelector(selectActiveSession);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<{
        id: string | number;
        name: string;
    } | null>(null);

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

            const task = tasks.find((t) => String(t.id) === String(taskId));
            if (task) {
                setTaskToDelete({ id: taskId, name: task.name });
                setIsDeleteModalOpen(true);
            }
        },
        [projectId, tasks]
    );

    const confirmDelete = useCallback(() => {
        if (taskToDelete) {
            dispatch(deleteTask({ taskId: taskToDelete.id }));
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        }
    }, [dispatch, taskToDelete]);

    const cancelDelete = useCallback(() => {
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
    }, []);

    const handleStartTimer = useCallback(
        (taskId: string | number) => {
            if (!user?.id) {
                
                    "[TaskActionsHandler] handleStartTimer - No user ID available"
                );
                return;
            }

            if (activeSession) {
                
                    "[TaskActionsHandler] handleStartTimer - Cannot start new timer, a session is already active"
                );
                return;
            }

            
                `[TaskActionsHandler] handleStartTimer - Starting timer for task ${taskId}`
            );
            const numericUserId = parseInt(String(user.id), 10);
            const numericTaskId = parseInt(String(taskId), 10);

            const currentTask = tasks.find(
                (task) => String(task.id) === String(taskId)
            );

            if (!currentTask) {
                
                    `[TaskActionsHandler] Task ${taskId} not found in state`
                );
                return;
            }

            const taskData = {
                ...currentTask,
                status: "In Progress",
            };

            
                `[TaskActionsHandler] handleStartTimer - Setting task ${taskId} status to In Progress while preserving other fields`,
                taskData
            );

            dispatch(
                updateTask({
                    projectId,
                    taskId,
                    taskData,
                })
            )
                .then(() => {
                    
                        `[TaskActionsHandler] handleStartTimer - Status updated, now starting time tracking session for user ${numericUserId}, task ${numericTaskId}`
                    );

                    return dispatch(
                        startTaskSession({
                            userId: numericUserId,
                            taskId: numericTaskId,
                        })
                    );
                })
                .then((result) => {
                    
                        `[TaskActionsHandler] startTaskSession success:`,
                        result
                    );

                    dispatch(fetchActiveSession(numericUserId));

                    dispatch(fetchTaskTimeSummary(numericTaskId));
                    dispatch(fetchTaskTimeTrackings(numericTaskId));

                    
                        `[TaskActionsHandler] Timer started and UI data refreshed for task ${numericTaskId}`
                    );
                })
                .catch((error) => {
                    
                        `[TaskActionsHandler] Error in timer start flow:`,
                        error
                    );
                });
        },
        [user, projectId, dispatch, tasks, activeSession]
    );

    return {
        handleAddTask,
        handleDeleteTask,
        handleStartTimer,

        DeleteTaskModal: (
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                itemName={
                    taskToDelete?.name
                        ? `task "${taskToDelete.name}"`
                        : "this task"
                }
            />
        ),
    };
};

export default useTaskActionsHandler;
