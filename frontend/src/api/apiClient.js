import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backend-six-rho-97.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request automatically, or mock network if demo
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token === 'demo-access-token') {
    // Override the adapter for demo mode to mock backend responses
    config.adapter = function (config) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let mockData = { success: true, message: "Action successful (Demo Mode)" };
          
          if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
             try {
                const body = config.data ? JSON.parse(config.data) : {};
                mockData = { ...body, _id: "demo_" + Date.now(), id: "demo_" + Date.now() };
             } catch(e) {
                mockData = { _id: "demo_" + Date.now(), id: "demo_" + Date.now() };
             }
          } else if (config.method === 'get') {
             mockData = [];
             if (config.url.includes('category') || config.url.includes('categories')) {
                mockData = [
                  { _id: 'c1', name: 'Salary', type: 'income' }, 
                  { _id: 'c2', name: 'Freelance', type: 'income' },
                  { _id: 'c3', name: 'Food & Dining', type: 'expense' },
                  { _id: 'c4', name: 'Transport', type: 'expense' }
                ];
             } else if (config.url.includes('payment')) {
                mockData = [
                  { _id: 'p1', name: 'UPI' }, 
                  { _id: 'p2', name: 'Cash' },
                  { _id: 'p3', name: 'Credit Card' }
                ];
             }
          }
          
          resolve({
            data: mockData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: config,
            request: {}
          });
        }, 500); // simulate realistic network delay
      });
    };
  } else if (token) {
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
