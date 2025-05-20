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
        console.log(`[API] startUserTaskSession - Starting session for user ${userId}, task ${taskId}`);
        try {
            const response = await api.post<TimeTracking>(`/time-trackings/users/${userId}/tasks/${taskId}/start`);
            console.log(`[API] startUserTaskSession - Success:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error('[API] startUserTaskSession - Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async endSession(sessionId: number): Promise<TimeTracking> {
        console.log(`[API] endSession - Ending session ${sessionId}`);
        try {
            const response = await api.post<TimeTracking>(`/time-trackings/${sessionId}/end`);
            console.log(`[API] endSession - Success:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error('[API] endSession - Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async pauseSession(sessionId: number): Promise<TimeTracking> {
        console.log(`[API] pauseSession - Pausing session ${sessionId}`);
        try {
            const response = await api.post<TimeTracking>(`/time-trackings/${sessionId}/pause`);
            console.log(`[API] pauseSession - Success:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error('[API] pauseSession - Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async resumePausedSession(sessionId: number): Promise<TimeTracking> {
        console.log(`[API] resumePausedSession - Resuming paused session ${sessionId}`);
        try {
            const response = await api.post<TimeTracking>(`/time-trackings/${sessionId}/resume-paused`);
            console.log(`[API] resumePausedSession - Success:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error('[API] resumePausedSession - Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async getActiveSession(userId: number): Promise<TimeTracking | null> {
        console.log(`[API] getActiveSession - Fetching active session for user ${userId}`);
        try {
            const response = await api.get<TimeTracking>(`/time-trackings/users/${userId}/active`);
            console.log(`[API] getActiveSession - Success:`, response.data);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                console.log('[API] getActiveSession - No active session found (404)');
                return null;
            }
            console.error('[API] getActiveSession - Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async getTaskTimeSummary(taskId: number): Promise<TaskTimeSummary> {
        console.log(`[API] getTaskTimeSummary - Fetching time summary for task ${taskId}`);
        try {
            const response = await api.get<TaskTimeSummary>(`/time-trackings/tasks/${taskId}/summary`);
            console.log(`[API] getTaskTimeSummary - Success:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error(`[API] getTaskTimeSummary - Error:`, error.response?.data || error.message);
            throw error;
        }
    }

    async getTimeTrackingsByTaskId(taskId: number): Promise<TimeTracking[]> {
        console.log(`[API] getTimeTrackingsByTaskId - Fetching time trackings for task ${taskId}`);
        try {
            const response = await api.get<TimeTracking[]>(`/time-trackings?taskId=${taskId}`);
            console.log(`[API] getTimeTrackingsByTaskId - Success:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error(`[API] getTimeTrackingsByTaskId - Error:`, error.response?.data || error.message);
            throw error;
        }
    }

    async updateHeartbeat(sessionId: number): Promise<TimeTracking> {
        console.log(`[API] updateHeartbeat - Sending heartbeat for session ${sessionId}`);
        try {
            const response = await api.post<TimeTracking>(`/time-trackings/${sessionId}/heartbeat`);
            console.log(`[API] updateHeartbeat - Success:`, response.data);
            return response.data;
        } catch (error: any) {
            console.error('[API] updateHeartbeat - Error:', error.response?.data || error.message);
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