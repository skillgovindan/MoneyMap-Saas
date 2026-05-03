const personRepository = require("../repositories/personRepository");

const createPerson = async (data) => {
  try {
    const { name, phoneNumber } = data;
    if (!name) {
      throw new Error("name is required");
    }

    if (data.phoneNumber === "") {
      data.phoneNumber = undefined;
    }

    if (data.phoneNumber) {
      const existingPerson = await personRepository.getPersonByPhoneNumber(data.phoneNumber);
      if (existingPerson) {
        throw new Error("Person with this phone number already exists");
      }
    }

    return await personRepository.createPerson(data);
  } catch (error) {
    throw error;
  }
};

const getAllPersons = async () => {
  try {
    return await personRepository.getAllPersons();
  } catch (error) {
    throw error;
  }
};

const getPersonById = async (id) => {
  try {
    const person = await personRepository.getPersonById(id);
    if (!person) {
      throw new Error("Person not found");
    }
    return person;
  } catch (error) {
    throw error;
  }
};

const updatePersonById = async (id, data) => {
  try {
    const { name, phoneNumber } = data;
    if (!name) {
      throw new Error("name is required");
    }

    if (data.phoneNumber === "") {
      data.phoneNumber = undefined;
    }

    const existingPerson = await personRepository.getPersonById(id);
    if (!existingPerson) {
      throw new Error("Person not found");
    }

    if (data.phoneNumber && data.phoneNumber !== existingPerson.phoneNumber) {
      const duplicatePhone = await personRepository.getPersonByPhoneNumber(data.phoneNumber);
      if (duplicatePhone) {
        throw new Error("Person with this phone number already exists");
      }
    }

    return await personRepository.updatePersonById(id, data);
  } catch (error) {
    throw error;
  }
};

const patchPersonById = async (id, data) => {
  try {
    const existingPerson = await personRepository.getPersonById(id);
    if (!existingPerson) {
      throw new Error("Person not found");
    }

    if (data.phoneNumber === "") {
      data.phoneNumber = undefined;
    }

    if (data.phoneNumber && data.phoneNumber !== existingPerson.phoneNumber) {
      const duplicatePhone = await personRepository.getPersonByPhoneNumber(data.phoneNumber);
      if (duplicatePhone) {
        throw new Error("Person already exists");
      }
    }

    return await personRepository.patchPersonById(id, data);
  } catch (error) {
    throw error;
  }
};

const deletePersonById = async (id) => {
  try {
    const existingPerson = await personRepository.getPersonById(id);
    if (!existingPerson) {
      throw new Error("Person not found");
    }

    return await personRepository.deletePersonById(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPerson,
  getAllPersons,
  getPersonById,
  updatePersonById,
  patchPersonById,
  deletePersonById,
};
