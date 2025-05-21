import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://13.39.242.149:3000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;




        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            const config = error.config;
            const isAuthEndpoint =
                config?.url?.includes('/auth/login') ||
                config?.url?.includes('/users');

            if (!isAuthEndpoint) {
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                window.location.href = '/auth';
            }
        }

        if (error.response) {
            const errorMessage = error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
                ? error.response.data.message
                : error.message;


        }

        return Promise.reject(error);
    }
);

export default api; 