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

