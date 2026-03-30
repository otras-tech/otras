import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Admin Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized Error Handling & Refresh Logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('adminRefreshToken');

      if (refreshToken) {
        try {
          const resp = await axios.get(`${apiClient.defaults.baseURL}/admin/auth/refresh`, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });

          const { access_token, refresh_token } = resp.data;
          
          localStorage.setItem('adminToken', access_token);
          localStorage.setItem('adminRefreshToken', refresh_token);

          apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed', refreshError);
          // Fall through to logout
        }
      }

      console.warn('Unauthorized - clearing admin session');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
