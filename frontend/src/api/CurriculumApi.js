import axios from 'axios';
const BASE_URL = 'http://localhost:8080/curriculum';

export const fetchAllOfferings = () => axios.get(`${BASE_URL}/offerings`);
export const fetchOfferingById = (id) => axios.get(`${BASE_URL}/offerings/${id}`);
export const createOffering = (data) => axios.post(`${BASE_URL}/offerings`, data);
export const updateOffering = (id, data) => axios.put(`${BASE_URL}/offerings/${id}`, data);
export const deleteOffering = (id) => axios.delete(`${BASE_URL}/offerings/${id}`);
export const assignTeacher = (dto) => axios.post(`${BASE_URL}/assign-teacher`, dto);
export const fetchAllOfferingsWithAssignments = () =>
    axios.get(`${BASE_URL}/offerings/with-assignments`);
