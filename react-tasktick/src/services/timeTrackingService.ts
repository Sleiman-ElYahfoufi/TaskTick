import api from '../utils/api';

export interface TimeTracking {
    id: number;
    user_id: number;
    task_id: number;
    start_time?: string;
    end_time?: string;
    duration_hours?: number;
    date: string;
    is_active: boolean;
    is_paused: boolean;
    pause_time?: string;
    paused_duration_hours: number;
    last_heartbeat?: string;
    auto_paused: boolean;
    created_at: string;
    updated_at: string;
}

export interface TaskTimeSummary {
    task_id: number;
    total_duration_hours: number;
    session_count: number;
    last_session?: TimeTracking;
}

class TimeTrackingService {
    async startUserTaskSession(userId: number, taskId: number): Promise<TimeTracking> {

        try {
            const response = await api.post<TimeTracking>(`/time-trackings/users/${userId}/tasks/${taskId}/start`);

            return response.data;
        } catch (error: any) {

            throw error;
        }
    }

    async endSession(sessionId: number): Promise<TimeTracking> {

        try {
            const response = await api.post<TimeTracking>(`/time-trackings/${sessionId}/end`);

            return response.data;
        } catch (error: any) {

            throw error;
        }
    }

    async pauseSession(sessionId: number): Promise<TimeTracking> {

        try {
            const response = await api.post<TimeTracking>(`/time-trackings/${sessionId}/pause`);

            return response.data;
        } catch (error: any) {

            throw error;
        }
    }

    async resumePausedSession(sessionId: number): Promise<TimeTracking> {

        try {
            const response = await api.post<TimeTracking>(`/time-trackings/${sessionId}/resume-paused`);

            return response.data;
        } catch (error: any) {

            throw error;
        }
    }

    async getActiveSession(userId: number): Promise<TimeTracking | null> {

        try {
            const response = await api.get<TimeTracking>(`/time-trackings/users/${userId}/active`);

            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {

                return null;
            }

            throw error;
        }
    }

    async getTaskTimeSummary(taskId: number): Promise<TaskTimeSummary> {

        try {
            const response = await api.get<TaskTimeSummary>(`/time-trackings/tasks/${taskId}/summary`);

            return response.data;
        } catch (error: any) {

            throw error;
        }
    }

    async getTimeTrackingsByTaskId(taskId: number): Promise<TimeTracking[]> {

        try {
            const response = await api.get<TimeTracking[]>(`/time-trackings?taskId=${taskId}`);

            return response.data;
        } catch (error: any) {

            throw error;
        }
    }

    async updateHeartbeat(sessionId: number): Promise<TimeTracking> {

        try {
            const response = await api.post<TimeTracking>(`/time-trackings/${sessionId}/heartbeat`);

            return response.data;
        } catch (error: any) {

            throw error;
        }
    }

    formatTime(hours: number): string {
        if (Math.abs(hours) < 0.00001) {
            return "0h 0m";
        }

        const totalMinutes = Math.round(hours * 60);

        if (totalMinutes === 0) {
            return "< 1m";
        }

        const displayHours = Math.floor(totalMinutes / 60);
        const displayMinutes = totalMinutes % 60;

        if (displayHours === 0) {
            return `${displayMinutes}m`;
        }

        return `${displayHours}h ${displayMinutes}m`;
    }
}

export default new TimeTrackingService();