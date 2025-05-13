import api from '../utils/api';

export interface ProjectDetailsDto {
    name: string;
    description: string;
    priority?: string;
    detail_depth?: string;
    deadline?: string;
}

export interface GeneratedTaskDto {
    name: string;
    description?: string;
    estimated_time: number;
    priority?: string;
    dueDate?: string;
    progress?: number;
}

export interface GenerateTasksDto {
    projectDetails: ProjectDetailsDto;
    userId: number;
}

export interface DecompositionResult {
    projectDetails?: ProjectDetailsDto;
    tasks: GeneratedTaskDto[];
    projectId?: number;
    saved: boolean;
    userId?: number;
}

class ProjectDecompositionService {

}

export default new ProjectDecompositionService(); 