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

export const distributeStudents = (courseNumber, directionId) => {
    return axios.post(`${BASE_URL}/distribute`, null, {
        params: { courseNumber, directionId }
    });
};


export const transferStudentToGroup = (studentId, targetGroupId, force = false) => {
    return axios.post(`${BASE_URL}/transfer-student`, null, {
        params: { studentId, targetGroupId, force }
    });
};


export const assignCurator = (groupId, curatorId) => {
    return axios.post(`${BASE_URL}/${groupId}/assign-curator`, null, {
        params: { curatorId }
    });
};


export const assignCuratorsBulk = (assignments) => {
    return axios.post(`${BASE_URL}/assign-curators`, assignments);
};

