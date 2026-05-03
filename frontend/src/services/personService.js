import personRepository from '../repositories/personRepository';

export const createPerson = async (data) => {
  try {
    if (!data.name) {
      throw new Error("name is required");
    }
    return await personRepository.createPerson(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to create person");
  }
};

export const getAllPersons = async () => {
  try {
    return await personRepository.getAllPersons();
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch persons");
  }
};

export const getPersonById = async (id) => {
  try {
    if (!id) throw new Error("id is required");
    return await personRepository.getPersonById(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch person");
  }
};

export const updatePerson = async (id, data) => {
  try {
    if (!id || !data.name) {
      throw new Error("id and name are required");
    }
    return await personRepository.updatePerson(id, data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to update person");
  }
};

export const patchPerson = async (id, data) => {
  try {
    if (!id) throw new Error("id is required");
    return await personRepository.patchPerson(id, data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to patch person");
  }
};

export const deletePerson = async (id) => {
  try {
    if (!id) throw new Error("id is required");
    return await personRepository.deletePerson(id);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Failed to delete person");
  }
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
