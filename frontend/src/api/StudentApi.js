import axios from 'axios'

const BASE_URL = 'http://localhost:8080/students'

export const fetchStudents = () => axios.get(BASE_URL)

export const createStudent = (studentData) =>
    axios.post(BASE_URL, studentData)
