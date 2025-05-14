import api from '../utils/api';
import { ProjectStatus } from '../components/ProjectsComponents/ProjectCard/ProjectCard';

export interface Project {
    id: string | number;
    title?: string;
    name?: string;
    description: string;
    status: ProjectStatus;
    estimatedHours?: string;
    estimated_time?: number;
    tasksCompleted?: number;
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
                const projects = response.data.map(project => this.mapProjectData(project));
                return { projects, total: projects.length };
            }

            if (response.data && 'projects' in response.data && Array.isArray(response.data.projects)) {
                const projects = response.data.projects.map(project => this.mapProjectData(project));
                return {
                    projects,
                    total: response.data.total || projects.length
                };
            }

            console.warn('API response format is not as expected:', response.data);
            return { projects: [], total: 0 };
        } catch (error) {
            console.error('Error fetching user projects:', error);
            return { projects: [], total: 0 };
        }
    }

    private mapProjectData(project: Project): Project {
        const tasksCompleted = project.tasksCompleted || 0;
        const totalTasks = project.totalTasks || 10; // Default value

        let estimatedHours = '';
        if (project.estimated_time !== undefined) {
            if (project.estimated_time > 1000000) {
                estimatedHours = '1000+';
            } else {
                estimatedHours = project.estimated_time.toString();
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

        const status = statusMap[project.status?.toLowerCase()] || 'planning';

        return {
            id: project.id,
            title: project.name || project.title || '',
            description: project.description || '',
            status,
            estimatedHours,
            tasksCompleted,
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
            tasks: project.tasks
        };
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
        try {
            const project = await this.getProjectById(projectId);

            if (project && project.tasks && Array.isArray(project.tasks)) {
                return project.tasks.map(task => this.mapTaskData(task));
            }

            const response = await api.get<ProjectTask[] | ProjectTasksResponse>(`/tasks?projectId=${projectId}`);

            if (Array.isArray(response.data)) {
                return response.data.map(task => this.mapTaskData(task));
            }

            if (response.data && 'tasks' in response.data && Array.isArray(response.data.tasks)) {
                return response.data.tasks.map(task => this.mapTaskData(task));
            }

            return [];
        } catch (error) {
            console.error(`Error fetching tasks for project ${projectId}:`, error);
            return [];
        }
    }

    private mapTaskData(task: ProjectTask): ProjectTask {
        const estimatedHours = task.estimated_time !== undefined ? String(task.estimated_time) : '0';
        task.estimatedTime = `${estimatedHours} hrs`;

        // Format status to be more user-friendly
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
                default:
                    // Keep the status as is if it doesn't match our standard statuses
                    break;
            }
        } else {
            task.status = 'Not Started';
        }

        // Format priority to be more user-friendly
        if (task.priority) {
            const priorityMap: { [key: string]: string } = {
                'low': 'Low',
                'medium': 'Medium',
                'high': 'High',
                'critical': 'Critical'
            };
            task.priority = priorityMap[task.priority.toLowerCase()] || 'Medium';
        } else {
            task.priority = 'Medium';
        }

        // Set default progress if not provided
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

    async updateProject(projectId: string | number, project: Partial<Project>): Promise<Project> {
        try {
            const response = await api.put<Project>(`/projects/${projectId}`, project);
            return this.mapProjectData(response.data);
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

    async updateProjectTask(projectId: string | number, taskId: string | number, taskData: Partial<ProjectTask>): Promise<ProjectTask> {
        try {
            const {
                name,
                description,
                estimated_time,
                estimatedTime,
                dueDate,
                priority,
                progress,
                status
            } = taskData;

            const updateData: any = { project_id: Number(projectId) };

            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;

            if (estimated_time !== undefined) {
                const numValue = Number(estimated_time) || 0;
                console.log(`Parsed estimated_time to number: ${numValue}`);
                updateData.estimated_time = numValue;
            } else if (estimatedTime !== undefined) {
                let numValue = 0;
                if (typeof estimatedTime === 'string') {
                    const match = estimatedTime.match(/^(\d+(?:\.\d+)?)/);
                    if (match && match[1]) {
                        numValue = Number(match[1]) || 0;
                    }
                } else if (typeof estimatedTime === 'number') {
                    numValue = estimatedTime;
                }
                console.log(`Extracted numeric value from estimatedTime: ${numValue}`);
                updateData.estimated_time = numValue;
            }

            if (progress !== undefined) updateData.progress = progress;

            if (dueDate !== undefined) {
                if (dueDate && dueDate.trim() !== '') {
                    try {
                        const dateObj = new Date(dueDate);
                        if (!isNaN(dateObj.getTime())) {
                            updateData.dueDate = dateObj.toISOString();
                        }
                    } catch (e) {
                        console.warn(`Invalid date format for dueDate: ${dueDate}`);
                    }
                }
            }

            if (status !== undefined) {
                updateData.status = this.mapStatusToBackend(status);
            }

            if (priority !== undefined) {
                updateData.priority = this.mapPriorityToBackend(priority);
            }

            console.log('Updating task with data:', updateData);

            const response = await api.patch<ProjectTask>(`/tasks/${taskId}`, updateData);
            return this.mapTaskData(response.data);
        } catch (error) {
            console.error(`Error updating task ${taskId}:`, error);
            throw error;
        }
    }

    

    private mapStatusToBackend(status?: string): string {
        if (!status) return 'todo';

        const statusMap: { [key: string]: string } = {
            'Not Started': 'todo',
            'In Progress': 'in_progress',
            'Completed': 'completed'
        };

        return statusMap[status] || 'todo';
    }

    private mapPriorityToBackend(priority?: string): string {
        if (!priority) return 'medium';

        const priorityMap: { [key: string]: string } = {
            'Low': 'low',
            'Medium': 'medium',
            'High': 'high'
        };

        return priorityMap[priority] || 'medium';
    }
}

export default new ProjectsService(); 