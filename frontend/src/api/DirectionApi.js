import axios from 'axios'

const BASE_URL = 'http://localhost:8080/directions'

export const fetchDirections = () => axios.get(BASE_URL)

export const getAllDirections = () => axios.get(BASE_URL)