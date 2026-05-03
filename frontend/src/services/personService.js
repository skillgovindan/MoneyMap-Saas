import personRepository from '../repositories/personRepository';

const createPerson = async (data) => {
  try {
    if (!data.name) {
      throw new Error("name is required");
    }
    return await personRepository.createPerson(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to create person");
  }
};

const getAllPersons = async () => {
  try {
    return await personRepository.getAllPersons();
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch persons");
  }
};

const getPersonById = async (id) => {
  try {
    if (!id) throw new Error("id is required");
    return await personRepository.getPersonById(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch person");
  }
};

const updatePersonById = async (id, data) => {
  try {
    if (!id || !data.name) {
      throw new Error("id and name are required");
    }
    return await personRepository.updatePersonById(id, data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to update person");
  }
};

const patchPersonById = async (id, data) => {
  try {
    if (!id) throw new Error("id is required");
    return await personRepository.patchPersonById(id, data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to patch person");
  }
};

const deletePersonById = async (id) => {
  try {
    if (!id) throw new Error("id is required");
    return await personRepository.deletePersonById(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to delete person");
  }
};

export default {
  createPerson,
  getAllPersons,
  getPersonById,
  updatePersonById,
  patchPersonById,
  deletePersonById,
};
