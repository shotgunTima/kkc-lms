import axios from "axios";

const API_URL = "http://localhost:8080/api/semesters";


export const fetchSemesters = () => axios.get(API_URL);
export const fetchSemesterById = (id) => axios.get(`${API_URL}/${id}`);
export const createSemester = (data) => axios.post(API_URL, data);
export const updateSemester = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteSemester = (id) => axios.delete(`${API_URL}/${id}`);
