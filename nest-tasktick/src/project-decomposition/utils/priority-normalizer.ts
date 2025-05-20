import { PriorityLevel as ProjectPriorityLevel, DetailDepth } from '../../projects/entities/project.entity';
import { PriorityLevel as TaskPriorityLevel } from '../../tasks/entities/task.entity';


export function normalizeProjectPriority(priority?: string): ProjectPriorityLevel {
    if (!priority) return ProjectPriorityLevel.MEDIUM;

    return priority.toLowerCase() === 'high' ? ProjectPriorityLevel.HIGH :
        priority.toLowerCase() === 'low' ? ProjectPriorityLevel.LOW :
            ProjectPriorityLevel.MEDIUM;
}


export function normalizeDetailDepth(detailDepth?: string): DetailDepth {
    if (!detailDepth) return DetailDepth.NORMAL;

    return detailDepth.toLowerCase() === 'detailed' ? DetailDepth.DETAILED :
        detailDepth.toLowerCase() === 'minimal' ? DetailDepth.MINIMAL :
            DetailDepth.NORMAL;
}



export function mapToTaskPriority(priority: string): TaskPriorityLevel {
    return priority.toLowerCase() === 'high' ? TaskPriorityLevel.HIGH :
        priority.toLowerCase() === 'low' ? TaskPriorityLevel.LOW :
            TaskPriorityLevel.MEDIUM;
} 