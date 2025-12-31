import axios from 'axios';

const API_URL = 'https://esse-aqui-midia.vercel.app/api';

const getToken = () => localStorage.getItem('access_token');

const dashboardApi = axios.create({
  baseURL: API_URL,
});

dashboardApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dashboardService = {
  getStats: () => dashboardApi.get('/dashboard/stats'),
};
