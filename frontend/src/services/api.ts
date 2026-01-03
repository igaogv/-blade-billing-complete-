import axios from 'axios';

// VITE_API_URL deve vir das Environment Variables do Vercel
const API_URL = import.meta.env.VITE_API_URL || 'https://blade-billing-complete.vercel.app/api';

console.log('🔗 API URL configurada:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // Desabilitar credentials quando usando CORS com wildcard
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== CLIENTS ==========
export const clientsService = {
  async getAll() {
    const response = await api.get('/clients');
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/clients', data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

// ========== INVOICES ==========
export const invoicesService = {
  async findAll() {
    const response = await api.get('/invoices');
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/invoices', data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },

  async sendWhatsapp(id: string) {
    const response = await api.post(`/invoices/${id}/send-whatsapp`);
    return response.data;
  },
};

export default api;