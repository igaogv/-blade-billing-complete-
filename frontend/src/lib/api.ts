import axios from 'axios';

const api = axios.create({
  baseURL: 'https://esse-aqui-midia-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
