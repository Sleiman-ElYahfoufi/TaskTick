
export interface ParsedTask {
    name: string;
    description: string;
    estimated_time: number;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    progress: number;
} 