import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const isDevelopment = import.meta.env.MODE === 'development';

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;

            if (isDevelopment) {
                console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

