import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Add a request interceptor to add the JWT token to requests
// Add request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      toast.error('Unable to connect to server. Please try again later.');
    } else if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        window.location.href = '/login'; // Redirect to login
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error(error.response.data.message || 'An error occurred');
      }
    } else {
      toast.error('An unexpected error occurred');
    }
    return Promise.reject(error);
  }
);
