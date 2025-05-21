import api from '../utils/api';
import projectsService, { Project } from './projectsService';
import { ProjectStatus } from '../components/ProjectsComponents/ProjectCard/ProjectCard';

export interface DashboardStats {
    activeProjects: number;
    tasksCompleted: number;
    dueToday: number;
}

export interface ProductivityData {
    date: string;
    value: number;
}

export interface Insight {
    id: string;
    text: string;
}

export interface ProductivityBreakdown {
    date: string;
    hours: number;
    taskCount: number;
}




export interface DashboardProject extends Project {
    progress: number;
    hours: string;
}

class DashboardService {
    async getStats(userId: number): Promise<DashboardStats> {
        try {
            const projectsData = await projectsService.getUserProjects(userId);
            const activeProjects = projectsData.projects.filter(p =>
                this.isInProgressStatus(p.status)).length;


            const tasksResponse = await api.get(`/tasks?userId=${userId}`);
            const tasks = tasksResponse.data;
            const tasksCompleted = tasks.filter((t: any) =>
                t.status?.toLowerCase() === 'completed' || t.status?.toLowerCase() === 'done').length;


            const today = new Date().toISOString().split('T')[0];
            const dueTodayTasks = tasks.filter((t: any) =>
                t.dueDate?.startsWith(today) &&
                t.status?.toLowerCase() !== 'completed' &&
                t.status?.toLowerCase() !== 'done');

            return {
                activeProjects,
                tasksCompleted,
                dueToday: dueTodayTasks.length
            };
        } catch (error) {

            return {
                activeProjects: 0,
                tasksCompleted: 0,
                dueToday: 0
            };
        }
    }


    private isInProgressStatus(status: string | undefined): boolean {
        if (!status) return false;

        const inProgressVariations = [
            'in-progress',
            'in_progress',
            'in progress',
            'inprogress'
        ];

        return inProgressVariations.includes(status.toLowerCase());
    }

    async getActiveProjects(userId: number): Promise<DashboardProject[]> {
        try {

            const projectsData = await projectsService.getUserProjects(userId);



            projectsData.projects.forEach(p => {

            });


            const activeProjects = projectsData.projects
                .filter(p => this.isInProgressStatus(p.status))
                .slice(0, 3);


            const formattedProjects = activeProjects.map(project => {

                let progress = 0;
                if (project.totalTasks && project.totalTasks > 0) {
                    progress = Math.round((project.completedTasks || 0) / project.totalTasks * 100);
                }


                let hours = '';
                if (project.estimated_time !== undefined && project.estimated_time !== null) {
                    hours = `${project.estimated_time}h`;
                } else if (project.estimatedHours) {
                    hours = project.estimatedHours;
                } else {
                    hours = '0h';
                }


                let displayStatus: ProjectStatus = 'in-progress';
                if (project.status === 'completed') {
                    displayStatus = 'completed';
                } else if (project.status === 'delayed') {
                    displayStatus = 'delayed';
                } else if (project.status === 'planning') {
                    displayStatus = 'planning';
                }

                return {
                    ...project,
                    id: project.id.toString(),
                    name: project.name || project.title || 'Untitled Project',
                    hours,
                    progress,

                    status: displayStatus,

                    description: project.description || '',
                    completedTasks: project.completedTasks || 0,
                    totalTasks: project.totalTasks || 0
                };
            });


            return formattedProjects;
        } catch (error) {

            return [];
        }
    }

    async getProductivityData(userId: number, days: number = 30): Promise<ProductivityData[]> {
        try {
            const response = await api.get(`/time-trackings/users/${userId}/productivity?days=${days}`);


            if (response.data && response.data.dailyBreakdown) {

                return this.transformToHeatmapData(response.data.dailyBreakdown);
            }

            return [];
        } catch (error) {

            return [];
        }
    }


    private transformToHeatmapData(dailyBreakdown: ProductivityBreakdown[]): any {
        return {
            dailyBreakdown: dailyBreakdown.map(day => ({
                ...day,
                date: day.date,
                taskCount: day.taskCount === 0 || day.taskCount === null || day.taskCount === undefined ? 0 : day.taskCount,
                hours: day.hours || 0
            }))
        };
    }

    async getAIInsights(userId: number): Promise<Insight[]> {
        try {
            const regenerationCheck = await api.get(`/ai-insights/check-regeneration?userId=${userId}`);
            const shouldRegenerate = regenerationCheck.data?.shouldRegenerate || false;

            if (shouldRegenerate) {
                await api.post('/ai-insights/generate', { userId });
            }

            const response = await api.get(`/ai-insights?userId=${userId}`);

            if (response.data && response.data.length > 0) {
                return response.data
                    .map((insight: { id: number, description: string }) => ({
                        id: insight.id.toString(),
                        text: insight.description
                    }))
                    .slice(0, 5);
            }

            const projectsData = await projectsService.getUserProjects(userId);
            const statsData = await this.getStats(userId);
            return this.generateInsights(projectsData.projects, statsData);
        } catch (error) {


            const projectsData = await projectsService.getUserProjects(userId);
            const statsData = await this.getStats(userId);
            return this.generateInsights(projectsData.projects, statsData);
        }
    }

    private generateInsights(projects: Project[], stats: DashboardStats): Insight[] {
        const insights: Insight[] = [];


        if (stats.dueToday > 0) {
            insights.push({
                id: `time-${Date.now()}-1`,
                text: `You have ${stats.dueToday} task${stats.dueToday > 1 ? 's' : ''} due today. Consider prioritizing them first.`
            });
        }


        if (projects.length > 0) {

            const lowestProgressProject = [...projects].sort((a, b) => {
                const progressA = a.totalTasks && a.totalTasks > 0 ? Math.round(((a.completedTasks || 0) / a.totalTasks) * 100) : 0;
                const progressB = b.totalTasks && b.totalTasks > 0 ? Math.round(((b.completedTasks || 0) / b.totalTasks) * 100) : 0;
                return progressA - progressB;
            })[0];

            if (lowestProgressProject) {
                const progress = lowestProgressProject.totalTasks && lowestProgressProject.totalTasks > 0 ?
                    Math.round(((lowestProgressProject.completedTasks || 0) / lowestProgressProject.totalTasks) * 100) : 0;

                insights.push({
                    id: `progress-${Date.now()}-1`,
                    text: `${lowestProgressProject.name || lowestProgressProject.title} is at ${progress}% completion. Consider focusing on advancing this project.`
                });
            }


            const highestProgressProject = [...projects].sort((a, b) => {
                const progressA = a.totalTasks && a.totalTasks > 0 ? Math.round(((a.completedTasks || 0) / a.totalTasks) * 100) : 0;
                const progressB = b.totalTasks && b.totalTasks > 0 ? Math.round(((b.completedTasks || 0) / b.totalTasks) * 100) : 0;
                return progressB - progressA;
            })[0];

            if (highestProgressProject) {
                const progress = highestProgressProject.totalTasks && highestProgressProject.totalTasks > 0 ?
                    Math.round(((highestProgressProject.completedTasks || 0) / highestProgressProject.totalTasks) * 100) : 0;

                if (progress > 75) {
                    insights.push({
                        id: `progress-${Date.now()}-2`,
                        text: `${highestProgressProject.name || highestProgressProject.title} is nearly complete at ${progress}%. A final push could complete it.`
                    });
                }
            }
        }


        insights.push({
            id: `productivity-${Date.now()}-1`,
            text: 'Your productivity peaks between 10AM-12PM. Schedule complex tasks during this window.'
        });


        if (stats.tasksCompleted > 0) {
            insights.push({
                id: `tasks-${Date.now()}-1`,
                text: `You've completed ${stats.tasksCompleted} task${stats.tasksCompleted > 1 ? 's' : ''} so far. Keep up the momentum!`
            });
        }

        insights.push({
            id: `tips-${Date.now()}-1`,
            text: 'Breaking down large tasks improves completion rates by 35%. Consider splitting complex tasks.'
        });

        return insights.slice(0, Math.min(5, Math.max(4, insights.length)));
    }
}

export default new DashboardService();