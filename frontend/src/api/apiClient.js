import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backend-six-rho-97.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token expired/invalid → redirect to login (skip for demo mode)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem('token');
      // Don't redirect if this is a demo session — demo token is intentionally fake
      if (token === 'demo-access-token') {
        return Promise.reject(error);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
