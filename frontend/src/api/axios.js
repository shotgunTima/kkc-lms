// src/api/axios.js
import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // важно если используете сессии / cookie
    headers: {
        'Content-Type': 'application/json'
    }
});


export default api;