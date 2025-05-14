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
   

    return {
      
    };
};

export default useTaskDataMapper; 