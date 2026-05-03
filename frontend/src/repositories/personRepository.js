import apiClient from '../api/apiClient';

export const createPerson = async (data) => {
  const response = await apiClient.post('/api/persons', data);
  return response.data;
};

export const getAllPersons = async () => {
  const response = await apiClient.get('/api/persons');
  return response.data;
};

export const getPersonById = async (id) => {
  const response = await apiClient.get(`/api/persons/${id}`);
  return response.data;
};

export const updatePerson = async (id, data) => {
  const response = await apiClient.put(`/api/persons/${id}`, data);
  return response.data;
};

export const patchPerson = async (id, data) => {
  const response = await apiClient.patch(`/api/persons/${id}`, data);
  return response.data;
};

export const deletePerson = async (id) => {
  const response = await apiClient.delete(`/api/persons/${id}`);
  return response.data;
};

// Aliases for backward compatibility
export const updatePersonById = updatePerson;
export const patchPersonById = patchPerson;
export const deletePersonById = deletePerson;

export default {
  createPerson,
  getAllPersons,
  getPersonById,
  updatePerson,
  patchPerson,
  deletePerson,
  updatePersonById,
  patchPersonById,
  deletePersonById,
};
