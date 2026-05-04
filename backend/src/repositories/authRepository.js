const User = require("../models/userModel");

// DB operations only — no try/catch, no business logic

const findUserByPhoneNumber = (phoneNumber) => {
  return User.findOne({ phoneNumber });
};

const createUser = (data) => {
  return User.create(data);
};

const updateUserById = (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

const findUserById = (id) => {
  return User.findById(id).select("-password");
};

module.exports = {
  findUserByPhoneNumber,
  createUser,
  updateUserById,
  findUserById,
};
