import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://esse-aqui-midia-backend.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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
