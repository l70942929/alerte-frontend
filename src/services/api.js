import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://larrissa.pythonanywhere.com/api/';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

export default api;