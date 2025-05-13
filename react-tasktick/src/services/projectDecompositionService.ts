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
    async generateTasks(data: GenerateTasksDto): Promise<DecompositionResult> {
        const requestData = { ...data };

        if (requestData.projectDetails && requestData.projectDetails.priority) {
            requestData.projectDetails.priority = requestData.projectDetails.priority.toLowerCase();
        }

        if (requestData.projectDetails && requestData.projectDetails.detail_depth) {
            requestData.projectDetails.detail_depth = requestData.projectDetails.detail_depth.toLowerCase();
        }

        const response = await api.post<DecompositionResult>('/project-decomposition/generate', requestData);
        return response.data;
    }

    async saveTasks(data: DecompositionResult): Promise<DecompositionResult> {
        const requestData = JSON.parse(JSON.stringify(data));

        if (requestData.projectDetails && requestData.projectDetails.priority) {
            requestData.projectDetails.priority = requestData.projectDetails.priority.toLowerCase();
        }

        if (requestData.projectDetails && requestData.projectDetails.detail_depth) {
            requestData.projectDetails.detail_depth = requestData.projectDetails.detail_depth.toLowerCase();
        }

        

        const response = await api.post<DecompositionResult>('/project-decomposition/save', requestData);
        return response.data;
    }
}

export default new ProjectDecompositionService(); 