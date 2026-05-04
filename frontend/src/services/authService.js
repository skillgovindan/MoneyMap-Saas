import * as authRepository from '../repositories/authRepository';

// Store token & user in localStorage
const saveAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Clear auth data on logout
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get current logged-in user
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get token
const getToken = () => localStorage.getItem('token');

// Register using main backend
const register = async (data) => {
  try {
    const responseData = await authRepository.registerUser(data);
    const { token, user } = responseData;
    saveAuth(token, user);
    return responseData;
  } catch (error) {
    if (!error.response) {
      throw new Error('Unable to connect to server. Please check if backend is running on port 5000.');
    }
    throw new Error(error.response.data.message || 'Registration failed');
  }
};

// Login using main backend
const login = async (data) => {
  try {
    const responseData = await authRepository.loginUser(data);
    const { token, user } = responseData;
    saveAuth(token, user);
    return responseData;
  } catch (error) {
    if (!error.response) {
      throw new Error('Unable to connect to server. Please check if backend is running on port 5000.');
    }
    throw new Error(error.response.data.message || 'Login failed');
  }
};

const authService = {
  register,
  login,
  logout,
  isAuthenticated,
  getUser,
  getToken,
};

export default authService;
