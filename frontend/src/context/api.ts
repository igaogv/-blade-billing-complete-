// URL da API em produção (Vercel) ou desenvolvimento (localhost)
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_API_BASE_URL ||
  'https://esse-aqui-midia.vercel.app/api';

export default API_BASE_URL;
