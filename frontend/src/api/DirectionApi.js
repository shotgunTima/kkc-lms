import axios from 'axios'

const BASE_URL = 'http://localhost:8080/directions'

export const getAllDirections = () => axios.get(BASE_URL)

export const createDirection = (dirData) => {
    return axios.post(BASE_URL, dirData);
};

export const deleteDirection = (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
};

export const updateDirection = (id, groupData) => {
    return axios.put(`${BASE_URL}/${id}`, groupData);
};

export const getDirectionById = (id) => {
    return axios.get(`${BASE_URL}/${id}`);
};
