import axios from 'axios'

const BASE_URL = 'http://localhost:8080/teachers'


export const fetchTeachers = () => axios.get(BASE_URL)

export const getAllTeachers = () => axios.get(BASE_URL)