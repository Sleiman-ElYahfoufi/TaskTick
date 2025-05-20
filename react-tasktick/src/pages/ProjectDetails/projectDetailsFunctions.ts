export interface Task {
    id: string | number;
    name: string;
    description?: string;
    dueDate?: string;
    estimatedTime?: string;
    elapsedTime?: string;
    status?: string;
    priority?: string;
    progress?: number;
    [key: string]: any;
}

export interface ProjectData {
    id: string | number;
    name: string;
    description?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
    totalTasks?: number;
    completedTasks?: number;
    [key: string]: any;
}

export interface TaskTimeSummary {
    session_count: number;
    total_duration_hours: number;
}

export interface TaskDetails {
    sessions: number;
    totalTime: string;
}

export interface TableColumn {
    id: string;
    header: string | React.ReactNode;
    accessorKey: string;
    cell?: (info: any) => React.ReactNode;
    enableEditing?: boolean;
    enableSorting?: boolean;
    size?: number;
}

export interface TimeTrackingSession {
    id: number;
    task_id: number;
    user_id: number;
    start_time: string;
    end_time?: string | null;
    duration_seconds?: number;
}


export const EDITABLE_FIELDS = [
    "name",
    "estimatedTime",
    "dueDate",
    "description",
    "priority",
    "progress",
];

export const formatTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
};

export const getSelectedTask = (tasks: Task[], selectedTaskId: string | number | null, currentTask: Task | null): Task | null => {
    if (!selectedTaskId) return currentTask;
    return tasks.find((task) => String(task.id) === String(selectedTaskId)) || currentTask;
};

export const calculateProjectCompletionPercentage = (completedTasks: number, totalTasks: number): number => {
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
}; 