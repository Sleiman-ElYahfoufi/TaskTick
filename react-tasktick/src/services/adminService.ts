import api from '../utils/api';

export interface AnalyticsOverview {
    users: {
        total: number;
        newLastMonth: number;
        activeLastWeek: number;
    };
    projects: {
        total: number;
        active: number;
        completed: number;
        planning: number;
    };
    tasks: {
        total: number;
        completed: number;
        inProgress: number;
        todo: number;
    };
}

export interface ChartDataPoint {
    label: string;
    value: number;
}

class AdminService {
    async getAnalyticsOverview(): Promise<AnalyticsOverview> {
        try {
            const response = await api.get('/admin/analytics/overview');
            return response.data;
        } catch (error) {
            console.error('Error fetching analytics overview:', error);
            return {
                users: { total: 0, newLastMonth: 0, activeLastWeek: 0 },
                projects: { total: 0, active: 0, completed: 0, planning: 0 },
                tasks: { total: 0, completed: 0, inProgress: 0, todo: 0 }
            };
        }
    }

    async getUserGrowthData(): Promise<ChartDataPoint[]> {
        try {
            const response = await api.get('/admin/analytics/user-growth');
            return response.data;
        } catch (error) {
            console.error('Error fetching user growth data:', error);
            // Return fallback data for the past 12 months if API fails
            return [
                { label: 'Jan', value: 0 },
                { label: 'Feb', value: 0 },
                { label: 'Mar', value: 0 },
                { label: 'Apr', value: 0 },
                { label: 'May', value: 0 },
                { label: 'Jun', value: 0 },
                { label: 'Jul', value: 0 },
                { label: 'Aug', value: 0 },
                { label: 'Sep', value: 0 },
                { label: 'Oct', value: 0 },
                { label: 'Nov', value: 0 },
                { label: 'Dec', value: 0 }
            ];
        }
    }

    async getProjectStatusData(): Promise<ChartDataPoint[]> {
        try {
            const response = await api.get('/admin/analytics/projects-status');
            return response.data;
        } catch (error) {
            console.error('Error fetching project status data:', error);
            return [
                { label: 'Active', value: 0 },
                { label: 'Completed', value: 0 },
                { label: 'Planning', value: 0 }
            ];
        }
    }

    async getTasksProgressData(): Promise<{ month: string; completed: number; pending: number }[]> {
        try {
            const response = await api.get('/admin/analytics/tasks-progress');
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks progress data:', error);
            // Return empty data for 12 months if API fails
            return Array(12).fill(0).map((_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - 11 + i);
                return {
                    month: date.toLocaleString('default', { month: 'short' }),
                    completed: 0,
                    pending: 0
                };
            });
        }
    }

    async getTimeTrackingData(): Promise<ChartDataPoint[]> {
        try {
            const response = await api.get('/admin/analytics/time-tracking');
            return response.data;
        } catch (error) {
            console.error('Error fetching time tracking data:', error);
            return [
                { label: 'Web Dev', value: 0 },
                { label: 'Mobile Dev', value: 0 },
                { label: 'Backend Dev', value: 0 },
                { label: 'UI/UX', value: 0 },
                { label: 'Testing', value: 0 },
                { label: 'Meetings', value: 0 }
            ];
        }
    }
}

const adminService = new AdminService();
export default adminService; 