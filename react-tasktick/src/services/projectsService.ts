import api from '../utils/api';
import { ProjectStatus } from '../components/ProjectsComponents/ProjectCard/ProjectCard';
import tasksService from './tasksService';

export interface Project {
    id: string | number;
    title?: string;
    name?: string;
    description: string;
    status: ProjectStatus;
    estimatedHours?: string;
    estimated_time?: number;
    tasksCompleted?: number;
    completedTasks?: number;
    totalTasks?: number;
    lastUpdatedDate?: string;
    lastUpdatedTime?: string;
    userId?: number;
    user_id?: number;
    priority?: string;
    detail_depth?: string;
    deadline?: string | null;
    created_at?: string;
    updated_at?: string;
    accuracy_rating?: number;
    tasks?: ProjectTask[];
}

export interface ProjectTask {
    id: string | number;
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
    hours_spent?: number;
    project_name?: string;
}

export interface ProjectsResponse {
    projects: Project[];
    total: number;
}

export interface ProjectTasksResponse {
    tasks: ProjectTask[];
    total: number;
}

class ProjectsService {
    async getUserProjects(userId: number): Promise<ProjectsResponse> {
        try {
            const response = await api.get<Project[] | ProjectsResponse>(`/projects?userId=${userId}`);

            if (Array.isArray(response.data)) {
                const projects = response.data;
                return { projects, total: projects.length };
            }

            if (response.data && 'projects' in response.data && Array.isArray(response.data.projects)) {
                return response.data;
            }

            console.warn('API response format is not as expected:', response.data);
            return { projects: [], total: 0 };
        } catch (error) {
            console.error('Error fetching user projects:', error);
            return { projects: [], total: 0 };
        }
    }

    private mapProjectData(project: Project): Project {

        const completedTasks = project.completedTasks !== undefined ? project.completedTasks :
            project.tasks?.filter(t =>
                t.status?.toLowerCase() === "completed" ||
                t.status?.toLowerCase() === "done"
            ).length || 0;

        const totalTasks = project.totalTasks !== undefined ? project.totalTasks :
            project.tasks?.length || 0;

        let estimatedHours = '';
        if (project.estimated_time !== undefined) {
            if (project.estimated_time > 1000) {
                estimatedHours = '1000+';
            } else {
                estimatedHours = `${project.estimated_time}h`;
            }
        }

        const updatedDate = project.updated_at ? new Date(project.updated_at) : new Date();
        const now = new Date();

        let lastUpdatedDate = '';
        if (updatedDate.toDateString() === now.toDateString()) {
            lastUpdatedDate = 'Today';
        } else {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            if (updatedDate.toDateString() === yesterday.toDateString()) {
                lastUpdatedDate = 'Yesterday';
            } else {
                lastUpdatedDate = updatedDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });
            }
        }

        const lastUpdatedTime = updatedDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        const statusMap: { [key: string]: ProjectStatus } = {
            'planning': 'planning',
            'in_progress': 'in-progress',
            'in progress': 'in-progress',
            'delayed': 'delayed',
            'completed': 'completed'
        };

        // Handle status mapping with more care
        let status: ProjectStatus = 'planning'; // Default
        if (project.status) {
            const normalizedStatus = project.status.toLowerCase();
            if (statusMap[normalizedStatus]) {
                status = statusMap[normalizedStatus];
            } else if (normalizedStatus === 'in-progress') {
                // Handle case where UI format is already in the object
                status = 'in-progress';
            } else {
                console.warn(`Unknown status "${project.status}" being mapped to "planning"`);
            }
        }

        const result = {
            id: project.id,
            title: project.name || project.title || '',
            description: project.description || '',
            status,
            estimatedHours,
            tasksCompleted: completedTasks,
            totalTasks,
            lastUpdatedDate,
            lastUpdatedTime,
            userId: project.user_id || project.userId,
            priority: project.priority,
            detail_depth: project.detail_depth,
            deadline: project.deadline,
            created_at: project.created_at,
            updated_at: project.updated_at,
            accuracy_rating: project.accuracy_rating,
            tasks: project.tasks,
            estimated_time: project.estimated_time,
        };

        return result;
    }

    async getProjectById(projectId: string | number): Promise<Project> {
        try {
            const response = await api.get<Project>(`/projects/${projectId}`);
            return this.mapProjectData(response.data);
        } catch (error) {
            console.error(`Error fetching project ${projectId}:`, error);
            throw error;
        }
    }

    async getProjectTasks(projectId: string | number): Promise<ProjectTask[]> {
        return tasksService.getTasksByProjectId(projectId);
    }

    mapTaskData(task: ProjectTask): ProjectTask {
        const estimatedHours = task.estimated_time !== undefined ? String(task.estimated_time) : '0';
        task.estimatedTime = `${estimatedHours} hrs`;

        if (task.status) {
            switch (task.status.toLowerCase()) {
                case 'todo':
                case 'not_started':
                case 'backlog':
                    task.status = 'Not Started';
                    break;
                case 'in_progress':
                case 'in progress':
                case 'started':
                    task.status = 'In Progress';
                    break;
                case 'completed':
                case 'done':
                    task.status = 'Completed';
                    break;
            }
        } else {
            task.status = 'Not Started';
        }

        if (task.progress === undefined) {
            task.progress = 0;
        }

        return task;
    }

    async createProject(project: Omit<Project, 'id'>): Promise<Project> {
        try {
            const response = await api.post<Project>('/projects', project);
            return this.mapProjectData(response.data);
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    // Convert between UI status format (with hyphen) and API format (with underscore)
    private uiToApiStatus(status: string): string {
        // Normalize the input
        const normalized = status.toLowerCase();

        // Already in API format with underscore
        if (normalized === "in_progress") return "in_progress";

        // Ensure we're sending exactly what the backend expects
        switch (normalized) {
            case "in-progress": return "in_progress";
            case "planning": return "planning";
            case "delayed": return "delayed";
            case "completed": return "completed";
            default: return "planning"; // Safe default
        }
    }

    // Convert from API status format (with underscore) to UI format (with hyphen)
    private apiToUiStatus(status: string): ProjectStatus {
        // Ensure we're using the correct UI format
        switch (status.toLowerCase()) {
            case "in_progress": return "in-progress";
            case "planning": return "planning";
            case "delayed": return "delayed";
            case "completed": return "completed";
            default: return "planning"; // Safe default
        }
    }

    async updateProject(projectId: string | number, project: Partial<Project>): Promise<Project> {
        try {
            // First get and store the current project with all its data
            const currentProject = await this.getProjectById(projectId);
            // Determine which status to use - use incoming status if provided
            // This allows explicit updates to status when needed
            let statusToSend;
            if (project.status) {
                // If we're explicitly passing a new status, use that
                statusToSend = project.status;
            } else {
                // Otherwise preserve the current status
                statusToSend = currentProject.status;
            }

            // Cache the important fields that must be preserved
            const preservedFields = {
                completedTasks: currentProject.completedTasks || 0,
                totalTasks: currentProject.totalTasks || 0,
                estimated_time: currentProject.estimated_time
            };

            // Create a clean API-only object with just the fields the backend expects
            const apiProject: any = {
                name: project.name || project.title,
                description: project.description,
                deadline: project.deadline,
                estimated_time: project.estimated_time,
                priority: project.priority,
                detail_depth: project.detail_depth
            };

            // ALWAYS include status in API call, using the properly formatted value
            if (statusToSend) {
                // Convert UI format to API format using our helper
                apiProject.status = this.uiToApiStatus(String(statusToSend));
            }
            const response = await api.patch<any>(`/projects/${projectId}`, apiProject);

            // Create merged result with both API response and preserved fields
            const mergedResult = {
                ...currentProject,          // Base is current project 
                ...response.data,           // Override with API response
                completedTasks: preservedFields.completedTasks,  // Force preserve task counts
                totalTasks: preservedFields.totalTasks,
                estimated_time: response.data.estimated_time ?? preservedFields.estimated_time
            };

            // ALWAYS convert the status in the response to UI format
            if (response.data.status) {
                mergedResult.status = this.apiToUiStatus(response.data.status);
            } else if (statusToSend) {
                // If API didn't return a status, use our converted version of what we sent
                mergedResult.status = this.apiToUiStatus(this.uiToApiStatus(String(statusToSend)));
            }
            return this.mapProjectData(mergedResult);
        } catch (error) {
            console.error(`Error updating project ${projectId}:`, error);
            throw error;
        }
    }

    async deleteProject(projectId: string | number): Promise<void> {
        try {
            await api.delete(`/projects/${projectId}`);
        } catch (error) {
            console.error(`Error deleting project ${projectId}:`, error);
            throw error;
        }
    }

    async updateProjectTask(taskId: string | number, taskData: Partial<ProjectTask>): Promise<ProjectTask> {
        console.warn('projectsService.updateProjectTask is deprecated, use tasksService.updateTask instead');
        return tasksService.updateTask(taskId, taskData);
    }

    async addProjectTask(projectId: string | number, taskData: Partial<ProjectTask>): Promise<ProjectTask> {
        console.warn('projectsService.addProjectTask is deprecated, use tasksService.createTask instead');
        return tasksService.createTask(projectId, taskData);
    }

    async deleteProjectTask(taskId: string | number): Promise<string | number> {
        console.warn('projectsService.deleteProjectTask is deprecated, use tasksService.deleteTask instead');
        return tasksService.deleteTask(taskId);
    }

    mapStatusToBackend(status?: string): string {
        if (!status) return 'todo';

        const statusMap: { [key: string]: string } = {
            'Not Started': 'todo',
            'In Progress': 'in_progress',
            'Completed': 'completed'
        };

        return statusMap[status] || 'todo';
    }

    mapPriorityToBackend(priority?: string): string {
        if (!priority) return 'medium';

        const priorityMap: { [key: string]: string } = {
            'Low': 'low',
            'Medium': 'medium',
            'High': 'high'
        };

        return priorityMap[priority] || 'medium';
    }

    formatProject(project: Project): Project {
        return this.mapProjectData(project);
    }
}

export default new ProjectsService(); 