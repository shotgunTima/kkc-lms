
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/users';

export const fetchUsers = () => {
    return axios.get(BASE_URL);
};

export const fetchUserById = (id) => {
    return axios.get(`${BASE_URL}/${id}`);
};

export const createUser = (userData) => {
    return axios.post(BASE_URL, userData);
};

export const deleteUser = (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
};


export const updateUser = (id, userData) => {
    return axios.put(`${BASE_URL}/${id}`, userData);
};

export const fetchRoles = () => {
    return axios.get('http://localhost:8080/api/roles/labels');
};
