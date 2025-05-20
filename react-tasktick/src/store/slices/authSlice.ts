import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface LoginCredentials {
    username: string;
    password: string;
}

interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}

interface AuthResponse {
    user: User;
    access_token: string;
}

const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'userData';

const saveTokenToStorage = (token: string): void => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

const saveUserToStorage = (user: User): void => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

const removeAuthFromStorage = (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
};

const getTokenFromStorage = (): string | null => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const handleAuthError = (error: any) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    return Array.isArray(error.message)
        ? error.message.join(', ')
        : error.message || 'Authentication failed';
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>(
                '/auth/login',
                credentials
            );

            const { user, access_token } = response.data;
            saveTokenToStorage(access_token);
            saveUserToStorage(user);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(handleAuthError(error));
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (credentials: RegisterCredentials, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>(
                '/users',
                credentials
            );

            const { user, access_token } = response.data;
            saveTokenToStorage(access_token);
            saveUserToStorage(user);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(handleAuthError(error));
        }
    }
);

const setPending = (state: AuthState) => {
    state.isLoading = true;
    state.error = null;
};

const setSuccess = (state: AuthState, action: PayloadAction<AuthResponse>) => {
    state.isLoading = false;
    state.isAuthenticated = true;
    state.user = action.payload.user;
    state.token = action.payload.access_token;
    state.error = null;
};

const setFailed = (state: AuthState, action: PayloadAction<any>) => {
    state.isLoading = false;
    state.error = action.payload as string;
};

let storedUser = null;
try {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    if (userData) {
        storedUser = JSON.parse(userData);
    }
} catch (e) {
    console.error('Failed to parse stored user data');
}

const initialState: AuthState = {
    user: storedUser,
    token: getTokenFromStorage(),
    isAuthenticated: !!getTokenFromStorage(),
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            removeAuthFromStorage();
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, setPending);
        builder.addCase(login.fulfilled, setSuccess);
        builder.addCase(login.rejected, setFailed);

        builder.addCase(register.pending, setPending);
        builder.addCase(register.fulfilled, setSuccess);
        builder.addCase(register.rejected, setFailed);
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 