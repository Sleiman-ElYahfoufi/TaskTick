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

