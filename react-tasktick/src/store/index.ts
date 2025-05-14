import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tasksReducer from './slices/tasksSlice';
import projectsReducer from './slices/projectsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: tasksReducer,
        projects: projectsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 