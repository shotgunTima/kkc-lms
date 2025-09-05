// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // нужно, если используете cookie
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(cfg => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        cfg.headers = cfg.headers || {};
        cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
});

export default api;
