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
        console.log(`[Redux] startTaskSession - Starting time tracking for user ${userId}, task ${taskId}`);
        try {
            const session = await timeTrackingService.startUserTaskSession(userId, taskId);
            console.log('[Redux] startTaskSession - Success', session);
            return session;
        } catch (error: any) {
            console.error('[Redux] startTaskSession - Failed', error);
            return rejectWithValue(error.message || 'Failed to start tracking session');
        }
    }
);

export const pauseSession = createAsyncThunk(
    'timeTrackings/pauseSession',
    async (sessionId: number, { rejectWithValue }) => {
        console.log(`[Redux] pauseSession - Pausing session ${sessionId}`);
        try {
            const session = await timeTrackingService.pauseSession(sessionId);
            console.log('[Redux] pauseSession - Success', session);
            return session;
        } catch (error: any) {
            console.error('[Redux] pauseSession - Failed', error);
            return rejectWithValue(error.message || 'Failed to pause tracking session');
        }
    }
);

export const resumeSession = createAsyncThunk(
    'timeTrackings/resumeSession',
    async (sessionId: number, { rejectWithValue }) => {
        console.log(`[Redux] resumeSession - Resuming session ${sessionId}`);
        try {
            const session = await timeTrackingService.resumePausedSession(sessionId);
            console.log('[Redux] resumeSession - Success', session);
            return session;
        } catch (error: any) {
            console.error('[Redux] resumeSession - Failed', error);
            return rejectWithValue(error.message || 'Failed to resume tracking session');
        }
    }
);

export const endSession = createAsyncThunk(
    'timeTrackings/endSession',
    async (sessionId: number, { rejectWithValue }) => {
        console.log(`[Redux] endSession - Ending session ${sessionId}`);
        try {
            const session = await timeTrackingService.endSession(sessionId);
            console.log('[Redux] endSession - Success', session);
            return session;
        } catch (error: any) {
            console.error('[Redux] endSession - Failed', error);
            return rejectWithValue(error.message || 'Failed to end tracking session');
        }
    }
);

export const fetchActiveSession = createAsyncThunk(
    'timeTrackings/fetchActiveSession',
    async (userId: number, { rejectWithValue }) => {
        console.log(`[Redux] fetchActiveSession - Fetching active session for user ${userId}`);
        try {
            const session = await timeTrackingService.getActiveSession(userId);
            console.log('[Redux] fetchActiveSession - Success', session);
            return session;
        } catch (error: any) {
            console.error('[Redux] fetchActiveSession - Failed', error);
            return rejectWithValue(error.message || 'Failed to fetch active session');
        }
    }
);

export const fetchTaskTimeSummary = createAsyncThunk(
    'timeTrackings/fetchTaskTimeSummary',
    async (taskId: number, { rejectWithValue }) => {
        console.log(`[Redux] fetchTaskTimeSummary - Fetching time summary for task ${taskId}`);
        try {
            const summary = await timeTrackingService.getTaskTimeSummary(taskId);
            console.log('[Redux] fetchTaskTimeSummary - Success', summary);
            return { taskId, summary };
        } catch (error: any) {
            console.error('[Redux] fetchTaskTimeSummary - Failed', error);
            return rejectWithValue(error.message || 'Failed to fetch task time summary');
        }
    }
);

export const fetchTaskTimeTrackings = createAsyncThunk(
    'timeTrackings/fetchTaskTimeTrackings',
    async (taskId: number, { rejectWithValue }) => {
        console.log(`[Redux] fetchTaskTimeTrackings - Fetching time trackings for task ${taskId}`);
        try {
            const timeTrackings = await timeTrackingService.getTimeTrackingsByTaskId(taskId);
            console.log('[Redux] fetchTaskTimeTrackings - Success', timeTrackings);
            return timeTrackings;
        } catch (error: any) {
            console.error('[Redux] fetchTaskTimeTrackings - Failed', error);
            return rejectWithValue(error.message || 'Failed to fetch task time trackings');
        }
    }
);

export const updateSessionHeartbeat = createAsyncThunk(
    'timeTrackings/updateSessionHeartbeat',
    async (sessionId: number, { rejectWithValue }) => {
        console.log(`[Redux] updateSessionHeartbeat - Updating heartbeat for session ${sessionId}`);
        try {
            const session = await timeTrackingService.updateHeartbeat(sessionId);
            console.log('[Redux] updateSessionHeartbeat - Success', session);
            return session;
        } catch (error: any) {
            console.error('[Redux] updateSessionHeartbeat - Failed', error);
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
            console.log('[Redux] resetTimeTracking - Resetting time tracking state');
            state.activeSession = null;
            state.timerRunning = false;
            state.elapsedTime = 0;
        },
        clearTimeTrackingError: (state) => {
            console.log('[Redux] clearTimeTrackingError - Clearing error state');
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(startTaskSession.pending, (state) => {
                console.log('[Redux] startTaskSession.pending');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(startTaskSession.fulfilled, (state, action) => {
                console.log('[Redux] startTaskSession.fulfilled', action.payload);
                state.isLoading = false;
                state.activeSession = action.payload;
                state.timerRunning = true;
                state.elapsedTime = calculateElapsedTimeFromSession(action.payload);
            })
            .addCase(startTaskSession.rejected, (state, action) => {
                console.log('[Redux] startTaskSession.rejected', action.payload);
                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(pauseSession.pending, (state) => {
                console.log('[Redux] pauseSession.pending');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(pauseSession.fulfilled, (state, action) => {
                console.log('[Redux] pauseSession.fulfilled', action.payload);
                state.isLoading = false;
                state.activeSession = action.payload;
                state.timerRunning = false;
            })
            .addCase(pauseSession.rejected, (state, action) => {
                console.log('[Redux] pauseSession.rejected', action.payload);
                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(resumeSession.pending, (state) => {
                console.log('[Redux] resumeSession.pending');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resumeSession.fulfilled, (state, action) => {
                console.log('[Redux] resumeSession.fulfilled', action.payload);
                state.isLoading = false;
                state.activeSession = action.payload;
                state.timerRunning = true;
            })
            .addCase(resumeSession.rejected, (state, action) => {
                console.log('[Redux] resumeSession.rejected', action.payload);
                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(endSession.pending, (state) => {
                console.log('[Redux] endSession.pending');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(endSession.fulfilled, (state, action) => {
                console.log('[Redux] endSession.fulfilled', action.payload);
                state.isLoading = false;
                state.activeSession = null;
                state.timerRunning = false;
                state.elapsedTime = 0;


                const taskId = action.payload.task_id;
                const sessionDuration = action.payload.duration_hours || 0;

                console.log(`[Redux] endSession.fulfilled - Task ${taskId} session completed with duration ${sessionDuration}h`);

                if (state.taskSummaries[taskId]) {
                    console.log(`[Redux] endSession.fulfilled - Updating cached task summary`);

                    const summary = state.taskSummaries[taskId];
                    summary.session_count = (summary.session_count || 0) + 1;
                    summary.total_duration_hours = (summary.total_duration_hours || 0) + sessionDuration;


                    summary.last_session = action.payload;
                }
            })
            .addCase(endSession.rejected, (state, action) => {
                console.log('[Redux] endSession.rejected', action.payload);
                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchActiveSession.pending, (state) => {
                console.log('[Redux] fetchActiveSession.pending');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchActiveSession.fulfilled, (state, action) => {
                console.log('[Redux] fetchActiveSession.fulfilled', action.payload);
                state.isLoading = false;
                state.activeSession = action.payload;
                state.timerRunning = action.payload !== null && !action.payload.is_paused;
                if (action.payload) {
                    state.elapsedTime = calculateElapsedTimeFromSession(action.payload);
                }
            })
            .addCase(fetchActiveSession.rejected, (state, action) => {
                console.log('[Redux] fetchActiveSession.rejected', action.payload);
                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchTaskTimeSummary.pending, (state) => {
                console.log('[Redux] fetchTaskTimeSummary.pending');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTaskTimeSummary.fulfilled, (state, action) => {
                console.log('[Redux] fetchTaskTimeSummary.fulfilled', action.payload);
                state.isLoading = false;
                state.taskSummaries[action.payload.taskId] = action.payload.summary;
            })
            .addCase(fetchTaskTimeSummary.rejected, (state, action) => {
                console.log('[Redux] fetchTaskTimeSummary.rejected', action.payload);
                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchTaskTimeTrackings.pending, (state) => {
                console.log('[Redux] fetchTaskTimeTrackings.pending');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTaskTimeTrackings.fulfilled, (state, action) => {
                console.log('[Redux] fetchTaskTimeTrackings.fulfilled', action.payload);
                state.isLoading = false;
                state.selectedTaskTimeTrackings = action.payload;
            })
            .addCase(fetchTaskTimeTrackings.rejected, (state, action) => {
                console.log('[Redux] fetchTaskTimeTrackings.rejected', action.payload);
                state.isLoading = false;
                state.error = action.payload as string;
            })


            .addCase(updateSessionHeartbeat.fulfilled, (state, action) => {
                console.log('[Redux] updateSessionHeartbeat.fulfilled', action.payload);
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