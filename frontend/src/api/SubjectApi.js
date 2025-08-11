import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/subjects';

export const fetchSubjects = () => axios.get(BASE_URL);
export const fetchSubjectById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createSubject = (subjectData) => axios.post(BASE_URL, subjectData);
export const updateSubject = (id, subjectData) => axios.put(`${BASE_URL}/${id}`, subjectData);
export const deleteSubject = (id) => axios.delete(`${BASE_URL}/${id}`);
