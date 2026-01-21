import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // Adjust if your backend port differs
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['X-Auth-Token'] = token; // MATCHES YOUR BACKEND HEADER
    }
    return config;
});

export default api;