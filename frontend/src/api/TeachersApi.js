import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/teachers';

export const fetchTeachers = () => axios.get(BASE_URL);
export const fetchTeacherById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createTeacher = (teacherData) => axios.post(BASE_URL, teacherData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateTeacher = (id, teacherData) => axios.put(`${BASE_URL}/${id}`, teacherData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteTeacher = (id) => axios.delete(`${BASE_URL}/${id}`);

export const fetchAcademicTitles = () => axios.get('http://localhost:8080/api/enums/academic-titles');
export const fetchTeacherStatuses = () => axios.get('http://localhost:8080/api/enums/teacher-status');
