import { useMemo } from 'react';

export interface UITask {
    id: string;
    name: string;
    description?: string;
    estimated_time?: number;
    estimatedTime?: string;
    dueDate?: string;
    priority?: string;
    progress?: number;
    status?: string;
    project_id?: number;
    created_at?: string;
    updated_at?: string;
    category?: string;
    elapsedTime?: string;
    hours_spent?: number;
}

interface TaskDataMapperProps {
    projectTasks: any[];
}

export const useTaskDataMapper = ({ projectTasks }: TaskDataMapperProps) => {
    const tasks: UITask[] = useMemo(
        () =>
            projectTasks.map((task) => {
                const uiTask: UITask = {
                    id: String(task.id),
                    name: task.name,
                    description: task.description,
                    estimated_time: task.estimated_time,
                    estimatedTime: task.estimatedTime || "0 hrs",
                    dueDate: task.dueDate || "Not set",
                    priority: task.priority || "Medium",
                    progress: task.progress || 0,
                    status: task.status || "Not Started",
                    project_id: task.project_id,
                    created_at: task.created_at,
                    updated_at: task.updated_at,
                    category: task.description
                        ? task.description.split(" ")[0]
                        : "General",
                    elapsedTime: "00:00:00",
                    hours_spent: task.hours_spent,
                };
                return uiTask;
            }),
        [projectTasks]
    );

    const currentTask = useMemo(() => {
        const inProgressTask = tasks.find(
            (task) =>
                task.status === "In Progress" ||
                task.status === "in_progress" ||
                task.status === "in progress"
        );

        if (inProgressTask) return inProgressTask;

        return tasks.length > 0 ? tasks[0] : null;
    }, [tasks]);

    return {
        tasks,
        currentTask
    };
};

export default useTaskDataMapper; 