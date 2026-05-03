import apiClient from '../api/apiClient';

const createPerson = async (data) => {
  const response = await apiClient.post('/api/persons', data);
  return response.data;
};

const getAllPersons = async () => {
  const response = await apiClient.get('/api/persons');
  return response.data;
};

const getPersonById = async (id) => {
  const response = await apiClient.get(`/api/persons/${id}`);
  return response.data;
};

const updatePersonById = async (id, data) => {
  const response = await apiClient.put(`/api/persons/${id}`, data);
  return response.data;
};

const patchPersonById = async (id, data) => {
  const response = await apiClient.patch(`/api/persons/${id}`, data);
  return response.data;
};

const deletePersonById = async (id) => {
  const response = await apiClient.delete(`/api/persons/${id}`);
  return response.data;
};

export default {
  createPerson,
  getAllPersons,
  getPersonById,
  updatePersonById,
  patchPersonById,
  deletePersonById,
};
