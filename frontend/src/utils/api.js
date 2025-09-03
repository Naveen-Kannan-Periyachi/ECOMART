import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../config/config.js';

const API_URL = config.API_URL;

console.log('=== API SETUP DEBUG ===');
console.log('Config object:', config);
console.log('API_URL from config:', API_URL);
console.log('import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('All environment variables:', import.meta.env);
console.log('======================');

// Ensure we have a valid API URL
const finalApiUrl = API_URL || 'http://localhost:5001/api';
console.log('Final API URL being used:', finalApiUrl);

export const api = axios.create({
  baseURL: finalApiUrl,
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
    
    // Debug: Log the final URL being constructed
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('=== API REQUEST DEBUG ===');
    console.log('Config object:', config);
    console.log('API Request URL:', fullUrl);
    console.log('Config baseURL:', config.baseURL);
    console.log('Config url:', config.url);
    console.log('Config method:', config.method);
    console.log('Config data:', config.data);
    console.log('========================');
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
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
