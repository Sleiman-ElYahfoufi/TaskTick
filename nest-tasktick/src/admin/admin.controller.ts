import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AdminGuard } from '../auth/admin.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';
import { TimeTrackingsService } from '../time-trackings/time-trackings.service';
import { ProjectStatus } from '../projects/entities/project.entity';
import { TaskStatus } from '../tasks/entities/task.entity';

interface MonthData {
    month: string;
    year: number;
}

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
    constructor(
        private readonly usersService: UsersService,
        private readonly projectsService: ProjectsService,
        private readonly tasksService: TasksService,
        private readonly timeTrackingsService: TimeTrackingsService
    ) { }

    @Get('users')
    findAllUsers() {
        return this.usersService.findAll();
    }

    @Post('users/admin')
    createAdminUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createAdmin(createUserDto);
    }

    @Post('users/:id/make-admin')
    makeUserAdmin(@Param('id') id: string) {
        return this.usersService.setAdminRole(+id);
    }

    @Get('analytics/overview')
    async getAnalyticsOverview() {
        const users = await this.usersService.findAll();
        const projects = await this.projectsService.findAll();
        const activeProjects = await this.projectsService.findByStatus(ProjectStatus.IN_PROGRESS);
        const completedProjects = await this.projectsService.findByStatus(ProjectStatus.COMPLETED);
        const planningProjects = await this.projectsService.findByStatus(ProjectStatus.PLANNING);

        const allTasks = await this.tasksService.findAll();
        const completedTasks = await this.tasksService.findAllByStatus(TaskStatus.COMPLETED);
        const inProgressTasks = await this.tasksService.findAllByStatus(TaskStatus.IN_PROGRESS);
        const todoTasks = await this.tasksService.findAllByStatus(TaskStatus.TODO);

        return {
            users: {
                total: users.length,
                newLastMonth: users.filter(
                    u => new Date(u.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length,
                activeLastWeek: users.filter(
                    u => new Date(u.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length
            },
            projects: {
                total: projects.length,
                active: activeProjects.length,
                completed: completedProjects.length,
                planning: planningProjects.length
            },
            tasks: {
                total: allTasks.length,
                completed: completedTasks.length,
                inProgress: inProgressTasks.length,
                todo: todoTasks.length
            }
        };
    }

    @Get('analytics/user-growth')
    async getUserGrowthData() {
        const users = await this.usersService.findAll();

        // Get the last 12 months
        const today = new Date();
        const months: MonthData[] = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({
                month: date.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear()
            });
        }

        // Calculate new users per month
        const newUsersByMonth = months.map(month => {
            const date = new Date(`${month.year}-${new Date(`${month.month} 1, 2000`).getMonth() + 1}-01`);
            const nextMonth = new Date(date);
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            const newUsers = users.filter(user => {
                const createdAt = new Date(user.created_at);
                return createdAt >= date && createdAt < nextMonth;
            }).length;

            return {
                label: month.month,
                value: newUsers
            };
        });

        return newUsersByMonth;
    }

    @Get('analytics/projects-status')
    async getProjectStatusData() {
        const activeProjects = await this.projectsService.findByStatus(ProjectStatus.IN_PROGRESS);
        const completedProjects = await this.projectsService.findByStatus(ProjectStatus.COMPLETED);
        const planningProjects = await this.projectsService.findByStatus(ProjectStatus.PLANNING);

        return [
            { label: 'Active', value: activeProjects.length },
            { label: 'Completed', value: completedProjects.length },
            { label: 'Planning', value: planningProjects.length }
        ];
    }

    @Get('analytics/tasks-progress')
    async getTasksProgressData() {
        const today = new Date();
        const months: MonthData[] = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({
                month: date.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear()
            });
        }

        const allTasks = await this.tasksService.findAll();

        // Calculate task progress per month
        const result = months.map(month => {
            const date = new Date(`${month.year}-${new Date(`${month.month} 1, 2000`).getMonth() + 1}-01`);
            const nextMonth = new Date(date);
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            const tasksBeforeEnd = allTasks.filter(task => new Date(task.created_at) < nextMonth);
            const completedTasksInMonth = tasksBeforeEnd.filter(task =>
                task.status === TaskStatus.COMPLETED &&
                new Date(task.updated_at) >= date &&
                new Date(task.updated_at) < nextMonth
            ).length;

            const pendingTasksAtEnd = tasksBeforeEnd.filter(task =>
                task.status !== TaskStatus.COMPLETED ||
                (new Date(task.updated_at) >= nextMonth)
            ).length;

            return {
                month: month.month,
                completed: completedTasksInMonth,
                pending: pendingTasksAtEnd
            };
        });

        return result;
    }

    @Get('analytics/time-tracking')
    async getTimeTrackingData() {
        const timeTrackings = await this.timeTrackingsService.findAll();

        // Get tasks mapped to projects to get project data
        const tasks = await this.tasksService.findAll();
        const taskProjectMap = {};
        tasks.forEach(task => {
            taskProjectMap[task.id] = task.project_id;
        });

        // Get projects to get project names/categories
        const projects = await this.projectsService.findAll();
        const projectMap = {};
        projects.forEach(project => {
            projectMap[project.id] = project;
        });

        // Calculate hours spent by category
        const categoriesMap = {};

        timeTrackings.forEach(tracking => {
            if (!tracking.duration_hours) return;

            const taskId = tracking.task_id;
            const projectId = taskProjectMap[taskId];

            if (!projectId) return;

            const project = projectMap[projectId];
            if (!project) return;

            // Creating categories based on project names
            // In a real app, you would have more specific categories
            let category = 'Other';

            if (project.name) {
                const name = project.name.toLowerCase();
                if (name.includes('web') || name.includes('frontend')) category = 'Web Dev';
                else if (name.includes('mobile') || name.includes('app')) category = 'Mobile Dev';
                else if (name.includes('backend') || name.includes('api')) category = 'Backend Dev';
                else if (name.includes('ui') || name.includes('ux') || name.includes('design')) category = 'UI/UX';
                else if (name.includes('test') || name.includes('qa')) category = 'Testing';
                else if (name.includes('meet') || name.includes('planning')) category = 'Meetings';
            }

            if (!categoriesMap[category]) categoriesMap[category] = 0;
            categoriesMap[category] += tracking.duration_hours;
        });

        // Format data for chart
        return Object.entries(categoriesMap).map(([label, hours]) => ({
            label,
            value: Math.round(hours as number)
        }));
    }
} 