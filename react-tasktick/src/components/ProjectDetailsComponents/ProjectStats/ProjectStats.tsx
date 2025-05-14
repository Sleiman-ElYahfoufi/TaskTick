import { useMemo } from 'react';
import { Project } from '../../../services/projectsService';

interface UITask {
    id: string;
    status?: string;
    estimated_time?: number;
    hours_spent?: number;
    [key: string]: any;
}

export interface ProjectStatsProps {
    project: Project | null;
    tasks: UITask[];
}

export interface ProjectUIProps {
    name: string;
    completedTasks: number;
    totalTasks: number;
    timeSpent: number;
    totalEstimatedTime: number;
}

export const useProjectStats = ({ project, tasks }: ProjectStatsProps): ProjectUIProps => {
    return useMemo(() => {
        if (!project || !tasks.length) {
            return {
                name: project
                    ? project.title || project.name || "Untitled Project"
                    : "Project",
                completedTasks: 0,
                totalTasks: 0,
                timeSpent: 0,
                totalEstimatedTime: 0,
            };
        }

        const completedTasks = tasks.filter(
            (task) => task.status === "Completed" || task.status === "completed"
        ).length;

        const totalEstimatedTime = tasks.reduce(
            (sum, task) => sum + (task.estimated_time || 0),
            0
        );

        const roundedEstimatedTime = Math.round(totalEstimatedTime);

        const timeSpent =
            (project as any).timeSpent ||
            tasks.reduce((sum, task) => sum + (task.hours_spent || 0), 0);

        const roundedTimeSpent = Math.round(timeSpent);

        return {
            name: project.title || project.name || "Untitled Project",
            completedTasks,
            totalTasks: tasks.length,
            timeSpent: roundedTimeSpent,
            totalEstimatedTime: roundedEstimatedTime,
        };
    }, [project, tasks]);
};

export default useProjectStats; 