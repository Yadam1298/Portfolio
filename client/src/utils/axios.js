// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://portfolio-1uf8.onrender.com', // change to production URL when deploying
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // optional: 10 seconds timeout
});

// Optional: attach token automatically
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
