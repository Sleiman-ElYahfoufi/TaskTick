import api from '../utils/api';
import { ProjectTask } from './projectsService';

class TasksService {

    async getAllUserTasks(): Promise<ProjectTask[]> {
        try {
            const response = await api.get<ProjectTask[]>('/tasks');

            if (!Array.isArray(response.data)) {
                return [];
            }

            return response.data.map(task => this.normalizeTaskData(task));
        } catch (error: any) {

            throw new Error(error.message || 'Failed to fetch tasks');
        }
    }


    async getTasksByProjectId(projectId: string | number): Promise<ProjectTask[]> {
        try {
            const response = await api.get<ProjectTask[]>(`/tasks?projectId=${projectId}`);

            if (!Array.isArray(response.data)) {
                return [];
            }

            return response.data.map(task => this.normalizeTaskData(task));
        } catch (error: any) {

            throw new Error(error.message || 'Failed to fetch project tasks');
        }
    }

    async createTask(projectId: string | number, taskData: Partial<ProjectTask>): Promise<ProjectTask> {
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

            const task: any = {
                project_id: Number(projectId),
                name: name || 'New Task'
            };

            if (estimated_time !== undefined) {
                task.estimated_time = Number(estimated_time) || 1;
            } else if (estimatedTime !== undefined) {
                let numValue = 1;
                if (typeof estimatedTime === 'string') {
                    const match = estimatedTime.match(/^(\d+(?:\.\d+)?)/);
                    if (match && match[1]) {
                        numValue = Number(match[1]) || 1;
                    }
                } else if (typeof estimatedTime === 'number') {
                    numValue = estimatedTime;
                }
                task.estimated_time = numValue;
            } else {
                task.estimated_time = 1;
            }

            if (description !== undefined) task.description = description;
            if (progress !== undefined) task.progress = progress;

            if (dueDate !== undefined && dueDate && typeof dueDate === 'string' && dueDate.trim() !== '') {
                try {
                    const dateObj = new Date(dueDate);
                    if (!isNaN(dateObj.getTime())) {
                        task.dueDate = dateObj.toISOString();
                    }
                } catch (e) {

                }
            }

            task.status = this.mapStatusToBackend(status);
            task.priority = this.mapPriorityToBackend(priority);

            const response = await api.post<ProjectTask>('/tasks', task);
            return this.normalizeTaskData(response.data);
        } catch (error: any) {

            throw new Error(error.message || 'Failed to create task');
        }
    }

    async updateTask(taskId: string | number, taskData: Partial<ProjectTask>): Promise<ProjectTask> {
        try {
            const {
                name,
                description,
                estimated_time,
                estimatedTime,
                dueDate,
                priority,
                progress,
                status,
                project_id
            } = taskData;

            const updateData: any = {};

            if (project_id !== undefined) {
                updateData.project_id = Number(project_id);
            }

            if (name !== undefined) {
                updateData.name = name && name.trim() !== '' ? name : "New Task";
            }

            if (description !== undefined) updateData.description = description;

            if (estimated_time !== undefined) {
                updateData.estimated_time = Number(estimated_time) || 0;
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
                updateData.estimated_time = numValue;
            }

            if (progress !== undefined) updateData.progress = progress;

            if (dueDate !== undefined) {
                if (dueDate && typeof dueDate === 'string' && dueDate.trim() !== '') {
                    try {
                        const dateObj = new Date(dueDate);
                        if (!isNaN(dateObj.getTime())) {
                            updateData.dueDate = dateObj.toISOString();
                        }
                    } catch (e) {

                    }
                }
            }

            if (status !== undefined) {
                updateData.status = this.mapStatusToBackend(status);
            }

            if (priority !== undefined) {
                updateData.priority = this.mapPriorityToBackend(priority);
            }

            const response = await api.patch<ProjectTask>(`/tasks/${taskId}`, updateData);
            return this.normalizeTaskData(response.data);
        } catch (error: any) {

            throw new Error(error.message || 'Failed to update task');
        }
    }


    async updateTaskField(taskId: string | number, field: string, value: any): Promise<ProjectTask> {
        try {
            let fieldValue = value;

            if (field === 'name' && (!value || (typeof value === 'string' && value.trim() === ''))) {
                fieldValue = "New Task";
            } else if (field === 'status') {
                fieldValue = this.mapStatusToBackend(value);
            } else if (field === 'priority') {
                fieldValue = this.mapPriorityToBackend(value);
            }

            const taskData = { [field]: fieldValue } as Partial<ProjectTask>;
            return this.updateTask(taskId, taskData);
        } catch (error: any) {

            throw new Error(error.message || `Failed to update ${field}`);
        }
    }


    async deleteTask(taskId: string | number): Promise<string | number> {
        try {
            await api.delete(`/tasks/${taskId}`);
            return taskId;
        } catch (error: any) {

            throw new Error(error.message || 'Failed to delete task');
        }
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


    private normalizeTaskData(task: ProjectTask): ProjectTask {
        const estimatedHours = task.estimated_time !== undefined ? String(task.estimated_time) : '0';
        const normalizedTask = {
            ...task,
            estimatedTime: `${estimatedHours} hrs`
        };

        if (task.status) {
            const status = task.status.toLowerCase();
            if (['todo', 'not_started', 'backlog'].includes(status)) {
                normalizedTask.status = 'Not Started';
            } else if (['in_progress', 'in progress', 'started'].includes(status)) {
                normalizedTask.status = 'In Progress';
            } else if (['completed', 'done'].includes(status)) {
                normalizedTask.status = 'Completed';
            }
        } else {
            normalizedTask.status = 'Not Started';
        }

        if (task.priority) {
            const priorityMap: { [key: string]: string } = {
                'low': 'Low',
                'medium': 'Medium',
                'high': 'High'
            };
            normalizedTask.priority = priorityMap[task.priority.toLowerCase()] || 'Medium';
        } else {
            normalizedTask.priority = 'Medium';
        }

        if (normalizedTask.progress === undefined) {
            normalizedTask.progress = 0;
        }

        return normalizedTask;
    }
}

export default new TasksService(); 