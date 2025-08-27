import axios from 'axios';

const BASE_URL = 'http://localhost:8080/groups';

export const createGroup = (groupData) => {
    return axios.post(BASE_URL, groupData);
};

export const fetchGroups = (params = {}) => {
    const filteredParams = {};
    if (params.direction) filteredParams.directionName = params.direction;
    if (params.search) filteredParams.search = params.search;

    return axios.get(BASE_URL, { params: filteredParams });
};

export const deleteGroup = (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
};

export const updateGroup = (id, groupData) => {
    return axios.put(`${BASE_URL}/${id}`, groupData);
};

export const getGroupById = (id) => {
    return axios.get(`${BASE_URL}/${id}`);
};

export const searchGroupByName = (name) => {
    const params = {};
    if (name) params.name = name;
    return axios.get(`${BASE_URL}/search`, { params });
};
