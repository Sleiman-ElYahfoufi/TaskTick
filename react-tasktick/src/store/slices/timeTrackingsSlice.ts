import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import timeTrackingService, { TimeTracking, TaskTimeSummary } from '../../services/timeTrackingService';
import { RootState } from '../index';

interface TimeTrackingsState {
    activeSession: TimeTracking | null;
    taskSummaries: Record<number, TaskTimeSummary>;
    selectedTaskTimeTrackings: TimeTracking[];
    isLoading: boolean;
    error: string | null;
    timerRunning: boolean;
    elapsedTime: number;
}

const initialState: TimeTrackingsState = {
    activeSession: null,
    taskSummaries: {},
    selectedTaskTimeTrackings: [],
    isLoading: false,
    error: null,
    timerRunning: false,
    elapsedTime: 0
};

export const startTaskSession = createAsyncThunk(
    'timeTrackings/startTaskSession',
    async ({ userId, taskId }: { userId: number, taskId: number }, { rejectWithValue }) => {

        try {
            const session = await timeTrackingService.startUserTaskSession(userId, taskId);

            return session;
        } catch (error: any) {

            return rejectWithValue(error.message || 'Failed to start tracking session');
        }
    }
);

export const pauseSession = createAsyncThunk(
    'timeTrackings/pauseSession',
    async (sessionId: number, { rejectWithValue }) => {

        try {
            const session = await timeTrackingService.pauseSession(sessionId);

            return session;
        } catch (error: any) {

            return rejectWithValue(error.message || 'Failed to pause tracking session');
        }
    }
);

export const resumeSession = createAsyncThunk(
    'timeTrackings/resumeSession',
    async (sessionId: number, { rejectWithValue }) => {

        try {
            const session = await timeTrackingService.resumePausedSession(sessionId);

            return session;
        } catch (error: any) {

            return rejectWithValue(error.message || 'Failed to resume tracking session');
        }
    }
);

export const endSession = createAsyncThunk(
    'timeTrackings/endSession',
    async (sessionId: number, { rejectWithValue }) => {

        try {
            const session = await timeTrackingService.endSession(sessionId);

            return session;
        } catch (error: any) {

            return rejectWithValue(error.message || 'Failed to end tracking session');
        }
    }
);

export const fetchActiveSession = createAsyncThunk(
    'timeTrackings/fetchActiveSession',
    async (userId: number, { rejectWithValue }) => {

        try {
            const session = await timeTrackingService.getActiveSession(userId);

            return session;
        } catch (error: any) {

            return rejectWithValue(error.message || 'Failed to fetch active session');
        }
    }
);

export const fetchTaskTimeSummary = createAsyncThunk(
    'timeTrackings/fetchTaskTimeSummary',
    async (taskId: number, { rejectWithValue }) => {

        try {
            const summary = await timeTrackingService.getTaskTimeSummary(taskId);

            return { taskId, summary };
        } catch (error: any) {

            return rejectWithValue(error.message || 'Failed to fetch task time summary');
        }
    }
);

export const fetchTaskTimeTrackings = createAsyncThunk(
    'timeTrackings/fetchTaskTimeTrackings',
    async (taskId: number, { rejectWithValue }) => {

        try {
            const timeTrackings = await timeTrackingService.getTimeTrackingsByTaskId(taskId);

            return timeTrackings;
        } catch (error: any) {

            return rejectWithValue(error.message || 'Failed to fetch task time trackings');
        }
    }
);

export const updateSessionHeartbeat = createAsyncThunk(
    'timeTrackings/updateSessionHeartbeat',
    async (sessionId: number, { rejectWithValue }) => {

        try {
            const session = await timeTrackingService.updateHeartbeat(sessionId);

            return session;
        } catch (error: any) {

            return rejectWithValue(error.message || 'Failed to update session heartbeat');
        }
    }
);


const calculateElapsedTimeFromSession = (session: TimeTracking): number => {
    if (!session || !session.created_at) return 0;

    const startTime = new Date(session.created_at).getTime();
    let endTime: number;

    if (session.is_paused && session.pause_time) {
        endTime = new Date(session.pause_time).getTime();
    } else if (session.end_time) {
        endTime = new Date(session.end_time).getTime();
    } else {
        endTime = Date.now();
    }


    const pausedMilliseconds = (session.paused_duration_hours || 0) * 60 * 60 * 1000;
    const elapsedMilliseconds = endTime - startTime - pausedMilliseconds;

    return Math.max(0, Math.floor(elapsedMilliseconds / 1000));
};

const timeTrackingsSlice = createSlice({
    name: 'timeTrackings',
    initialState,
    reducers: {
        updateElapsedTime: (state) => {
            if (state.timerRunning && state.activeSession) {
                state.elapsedTime = calculateElapsedTimeFromSession(state.activeSession);
            }
        },
        resetTimeTracking: (state) => {

            state.activeSession = null;
            state.timerRunning = false;
            state.elapsedTime = 0;
        },
        clearTimeTrackingError: (state) => {

            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(startTaskSession.pending, (state) => {

                state.isLoading = true;
                state.error = null;
            })
            .addCase(startTaskSession.fulfilled, (state, action) => {

                state.isLoading = false;
                state.activeSession = action.payload;
                state.timerRunning = true;
                state.elapsedTime = calculateElapsedTimeFromSession(action.payload);
            })
            .addCase(startTaskSession.rejected, (state, action) => {

                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(pauseSession.pending, (state) => {

                state.isLoading = true;
                state.error = null;
            })
            .addCase(pauseSession.fulfilled, (state, action) => {

                state.isLoading = false;
                state.activeSession = action.payload;
                state.timerRunning = false;
            })
            .addCase(pauseSession.rejected, (state, action) => {

                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(resumeSession.pending, (state) => {

                state.isLoading = true;
                state.error = null;
            })
            .addCase(resumeSession.fulfilled, (state, action) => {

                state.isLoading = false;
                state.activeSession = action.payload;
                state.timerRunning = true;
            })
            .addCase(resumeSession.rejected, (state, action) => {

                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(endSession.pending, (state) => {

                state.isLoading = true;
                state.error = null;
            })
            .addCase(endSession.fulfilled, (state, action) => {

                state.isLoading = false;
                state.activeSession = null;
                state.timerRunning = false;
                state.elapsedTime = 0;


                const taskId = action.payload.task_id;
                const sessionDuration = action.payload.duration_hours || 0;



                if (state.taskSummaries[taskId]) {


                    const summary = state.taskSummaries[taskId];
                    summary.session_count = (summary.session_count || 0) + 1;
                    summary.total_duration_hours = (summary.total_duration_hours || 0) + sessionDuration;


                    summary.last_session = action.payload;
                }
            })
            .addCase(endSession.rejected, (state, action) => {

                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchActiveSession.pending, (state) => {

                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchActiveSession.fulfilled, (state, action) => {

                state.isLoading = false;
                state.activeSession = action.payload;
                state.timerRunning = action.payload !== null && !action.payload.is_paused;
                if (action.payload) {
                    state.elapsedTime = calculateElapsedTimeFromSession(action.payload);
                }
            })
            .addCase(fetchActiveSession.rejected, (state, action) => {

                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchTaskTimeSummary.pending, (state) => {

                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTaskTimeSummary.fulfilled, (state, action) => {

                state.isLoading = false;
                state.taskSummaries[action.payload.taskId] = action.payload.summary;
            })
            .addCase(fetchTaskTimeSummary.rejected, (state, action) => {

                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchTaskTimeTrackings.pending, (state) => {

                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTaskTimeTrackings.fulfilled, (state, action) => {

                state.isLoading = false;
                state.selectedTaskTimeTrackings = action.payload;
            })
            .addCase(fetchTaskTimeTrackings.rejected, (state, action) => {

                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(updateSessionHeartbeat.fulfilled, (state, action) => {

                if (state.activeSession && state.activeSession.id === action.payload.id) {

                    state.activeSession = {
                        ...state.activeSession,
                        last_heartbeat: action.payload.last_heartbeat
                    };
                }
            });
    },
});


export const selectActiveSession = (state: RootState) => state.timeTrackings.activeSession;
export const selectTimerRunning = (state: RootState) => state.timeTrackings.timerRunning;
export const selectElapsedTime = (state: RootState) => state.timeTrackings.elapsedTime;
export const selectIsTimeTrackingLoading = (state: RootState) => state.timeTrackings.isLoading;
export const selectTimeTrackingError = (state: RootState) => state.timeTrackings.error;
export const selectTaskSummary = (taskId: number) => (state: RootState) =>
    state.timeTrackings.taskSummaries[taskId];
export const selectSelectedTaskTimeTrackings = (state: RootState) =>
    state.timeTrackings.selectedTaskTimeTrackings;


export const { updateElapsedTime, resetTimeTracking, clearTimeTrackingError } = timeTrackingsSlice.actions;

export default timeTrackingsSlice.reducer; 