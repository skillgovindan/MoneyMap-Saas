const bcrypt = require("bcryptjs");
const authRepository = require("../repositories/authRepository");
const generateToken = require("../utils/generateToken");

const registerUser = async (data) => {
  try {
    const { name, phoneNumber, password } = data;

    if (!name) throw new Error("name is required");
    if (!phoneNumber) throw new Error("phoneNumber is required");
    if (!password) throw new Error("password is required");
    if (password.length < 6) throw new Error("password minimum length is 6");

    const userExists = await authRepository.findUserByPhoneNumber(phoneNumber);
    if (userExists) throw new Error("Phone number already registered");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user first to get the _id
    const user = await authRepository.createUser({
      name,
      phoneNumber,
      password: hashedPassword,
    });

    // Generate dbName using user._id
    const dbName = `moneymap_user_${user._id}`;

    // Update user record with dbName
    const updatedUser = await authRepository.updateUserById(user._id, { dbName });

    const token = generateToken(updatedUser._id, updatedUser.role, dbName);

    return {
      message: "User registered successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
        dbName: updatedUser.dbName,
      },
      token,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to register user");
  }
};

const loginUser = async (data) => {
  try {
    const { phoneNumber, password } = data;

    if (!phoneNumber) throw new Error("phoneNumber is required");
    if (!password) throw new Error("password is required");

    const user = await authRepository.findUserByPhoneNumber(phoneNumber);
    if (!user) throw new Error("Invalid phone number or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid phone number or password");

    const token = generateToken(user._id, user.role, user.dbName);

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        dbName: user.dbName,
      },
    };
  } catch (error) {
    throw new Error(error.message || "Failed to login user");
  }
};

const getUserProfile = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const user = await authRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    throw new Error(error.message || "Failed to get user profile");
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
