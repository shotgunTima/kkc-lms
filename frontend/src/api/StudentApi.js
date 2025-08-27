import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/students';

export const fetchStudents = () => axios.get(BASE_URL);

export const deleteStudent = (id) => axios.delete(`${BASE_URL}/${id}`);

export const fetchStudentStatuses = () => axios.get('http://localhost:8080/api/enums/student-status');
export const fetchCourses = () => axios.get('http://localhost:8080/api/enums/courses');
