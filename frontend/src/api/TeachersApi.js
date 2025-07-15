import axios from 'axios';

const BASE_URL = 'http://localhost:8080/teachers';

export const fetchAllTeachers = (params = {}) => {
    return axios.get(BASE_URL, { params });
};

export const fetchTeacherById = (id) => {
    return axios.get(`${BASE_URL}/${id}`);
};

export const createTeacher = (teacherData) => {
    return axios.post(BASE_URL, teacherData);
};

export const deleteTeacher = (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
};

export const updateTeacher = (id, teacherData) => {
    return axios.put(`${BASE_URL}/${id}`, teacherData);
};

export const fetchStatuses = () => {
    return axios.get(`${BASE_URL}/statuses`);
};
