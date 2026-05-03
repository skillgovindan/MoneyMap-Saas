const Person = require("../models/personModel");

const createPerson = async (data) => {
  return await Person.create(data);
};

const getAllPersons = async () => {
  return await Person.find().sort({ createdAt: -1 });
};

const getPersonById = async (id) => {
  return await Person.findById(id);
};

const getPersonByPhoneNumber = async (phoneNumber) => {
  return await Person.findOne({ phoneNumber });
};

const updatePersonById = async (id, data) => {
  return await Person.findByIdAndUpdate(id, data, { new: true });
};

const patchPersonById = async (id, data) => {
  return await Person.findByIdAndUpdate(id, { $set: data }, { new: true });
};

const deletePersonById = async (id) => {
  return await Person.findByIdAndDelete(id);
};

module.exports = {
  createPerson,
  getAllPersons,
  getPersonById,
  getPersonByPhoneNumber,
  updatePersonById,
  patchPersonById,
  deletePersonById,
};
