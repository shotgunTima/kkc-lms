import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/teachers';

export const fetchTeachers = () => axios.get(BASE_URL);

export const deleteTeacher = (id) => axios.delete(`${BASE_URL}/${id}`);

export const fetchAcademicTitles = () => axios.get('http://localhost:8080/api/enums/academic-titles');
export const fetchTeacherStatuses = () => axios.get('http://localhost:8080/api/enums/teacher-status');
